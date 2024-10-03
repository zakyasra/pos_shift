from odoo import _, api, fields, models

class PosSession(models.Model):
    """Inheriting the pos session"""
    _inherit = 'pos.session'

    shift_ids = fields.One2many('pos.shift', 'pos_session_id', string='Shifts')

    def _pos_ui_models_to_load(self):
        """Pos ui models to load"""
        result = super()._pos_ui_models_to_load()
        result += {
            'pos.shift'
        }
        return result

    def _loader_params_pos_shift(self):
        """Load the fields to pos shift"""
        return {'search_params': {
            'domain': [("pos_session_id", '=', self.id)],
            'fields': ['name', 'end_datetime', 'pos_session_id', 'create_date']}}

    def _get_pos_ui_pos_shift(self, params):
        """Get pos ui pos shift"""
        return self.env['pos.shift'].sudo().search_read(
            **params['search_params'])
    
    def _loader_params_pos_session(self):
        res = super(PosSession, self)._loader_params_pos_session()
        res['search_params']['fields'].append('shift_ids')
        return res

    @api.model
    def create(self, vals):
        # Panggil metode create asli untuk membuat sesi
        session = super(PosSession, self).create(vals)
        
        # Logika untuk membuat shift baru dengan name '1'
        self.env['pos.shift'].sudo().create({
            'name': '1',
            'pos_session_id': session.id,
        })
        
        return session