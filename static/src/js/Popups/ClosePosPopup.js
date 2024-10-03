odoo.define("custom_sudo_pos_shift.ClosePosPopup", function (require) {
    "use strict";

    const ClosePosPopup = require("point_of_sale.ClosePosPopup");
    const Registries = require("point_of_sale.Registries");
    const { identifyError } = require('point_of_sale.utils');
    const { ConnectionLostError, ConnectionAbortedError } = require('@web/core/network/rpc_service')

    const SudoClosePosPopup = (ClosePosPopup) =>
        class extends ClosePosPopup {
            setup() {
                super.setup()
                this.shift = this.env.pos.default_pos_shift_ids;
            }

            async closeSession() {
                if (!this.closeSessionClicked) {
                    this.closeSessionClicked = true;
                    let response;
                    // If there are orders in the db left unsynced, we try to sync.
                    await this.env.pos.push_orders_with_closing_popup();
                    if (this.cashControl) {
                        response = await this.rpc({
                            model: "pos.session",
                            method: "post_closing_cash_details",
                            args: [this.env.pos.pos_session.id],
                            kwargs: {
                                counted_cash: this.state.payments[this.defaultCashDetails.id].counted
                            }
                        });
                        if (!response.successful) {
                            return this.handleClosingError(response);
                        }
                    }
                    await this.rpc({
                        model: "pos.session",
                        method: "update_closing_control_state_session",
                        args: [this.env.pos.pos_session.id, this.state.notes]
                    });
                    try {
                        const bankPaymentMethodDiffPairs = this.otherPaymentMethods
                            .filter((pm) => pm.type == "bank")
                            .map((pm) => [pm.id, this.state.payments[pm.id].difference]);
                        response = await this.rpc({
                            model: "pos.session",
                            method: "close_session_from_ui",
                            args: [this.env.pos.pos_session.id, bankPaymentMethodDiffPairs],
                            context: this.env.session.user_context
                        });
                        if (!response.successful) {
                            return this.handleClosingError(response);
                        }
                        await this.rpc({
                            model: "pos.shift",
                            method: "end_shift",
                            args: [[], this.env.pos.pos_session.id]
                        })
                        window.location = "/web#action=point_of_sale.action_client_pos_menu";
                    } catch (error) {
                        const iError = identifyError(error);
                        if (
                            iError instanceof ConnectionLostError ||
                            iError instanceof ConnectionAbortedError
                        ) {
                            await this.showPopup("ErrorPopup", {
                                title: this.env._t("Network Error"),
                                body: this.env._t("Cannot close the session when offline.")
                            });
                        } else {
                            await this.showPopup("ErrorPopup", {
                                title: this.env._t("Closing session error"),
                                body: this.env._t(
                                    "An error has occurred when trying to close the session.\n" +
                                    "You will be redirected to the back-end to manually close the session."
                                )
                            });
                            await this.rpc({
                                model: "pos.shift",
                                method: "end_shift",
                                args: [[], this.env.pos.pos_session.id]
                            })
                            window.location = "/web#action=point_of_sale.action_client_pos_menu";
                        }
                    }
                    this.closeSessionClicked = false;
                }
            }

            async endShift() {
                let self = this

                let { confirmed, payload } = await this.showPopup("ConfirmPopup", {
                    title: this.env._t("Warning!"),
                    body: this.env._t("Are you sure you want to end shift?"),
                    confirmText: this.env._t("Yes"),
                    cancelText: this.env._t("No")
                });

                if (confirmed) {
                    await self.rpc({
                        model: "pos.shift",
                        method: "change_shift",
                        args: [[], this.shift.id]
                    })

                }
                this.closePos()
            }
        }
    Registries.Component.extend(ClosePosPopup, SudoClosePosPopup);
    return ClosePosPopup;
});