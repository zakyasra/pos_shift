{
    'name': 'Sudo POS Shift',
    'version': '1.0',
    'description': """
        berubah
    """,
    'depends': [
        'point_of_sale',
    ],
    'summary': 'Extension Addons for Point Of Sale Module Tilabs v16',
    'author': 'Tilabs',
    'website': 'http://tilabs.id',
    'license': 'LGPL-3',
    'category': 'Point Of Sale',

    'data': [
        'views/pos_order_views_inherit.xml',
        'security/ir.model.access.csv',
    ],
    'assets': {
        'point_of_sale.assets': [
            'custom_sudo_pos_shift/static/src/js/models.js',
            'custom_sudo_pos_shift/static/src/js/Popups/ClosePosPopup.js',
            'custom_sudo_pos_shift/static/src/xml/ChromeWidget/CashierName.xml',
            'custom_sudo_pos_shift/static/src/xml/Popups/ClosePosPopup.xml',
        ]
    },

    'installable': True,
    'application': False,
}