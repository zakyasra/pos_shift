odoo.define('custom_sudo_pos_shift.models', function (require) {
    'use strict';

    const { PosGlobalState, Order } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const PosShiftPosGlobalState = (PosGlobalState) =>
        class PosShiftPosGlobalState extends PosGlobalState {
            constructor(obj) {
                super(obj);
                // console.log("------o90", this);
            }

            async _processData(loadedData) {
                await super._processData(...arguments);
                this.pos_shift_ids = loadedData['pos.shift'];

                this.default_pos_shift_ids = this.pos_shift_ids[this.pos_shift_ids.length - 1];
            }

            get_current_shift() {
                return this.default_pos_shift_ids
            }

            get_shift() {
                return this.pos_shift_ids
            }

            set_shift(shift) {
                this.shift_id = shift
            }
        }
    Registries.Model.extend(PosGlobalState, PosShiftPosGlobalState);

    const PosShiftOrder = (Order) =>
        class PosShiftOrder extends Order {
            constructor(obj, options) {
                super(...arguments);

                this.shift_id = this.pos.default_pos_shift_ids.id
            }

            export_as_JSON() {
                const res = super.export_as_JSON();
                res.shift_id = this.shift_id;
                // console.log("===== shift berubah", res);
                return res;
            }

            init_from_JSON(json) {
                super.init_from_JSON(...arguments);
                this.shift_id = json.shift;
            }
        }
    Registries.Model.extend(Order, PosShiftOrder);

    return {
        PosGlobalState,
        Order
    }
})