<?php

namespace App\Enums;

class OpcionesConstantes
{
    const ESP_PERFIL_EVEREST_ID = 5;
    const ESP_PERFIL_PANA_ID = 6;

    const OPCIONES = [
        'solicitar_correo' => [
            'label' => 'Requiere Correo Institucional',
            'opciones' => [1 => 'SI', 0 => 'NO']
        ],
        'solicitar_usuario_dominio' => [
            'label' => 'Requiere Usuario Dominio',
            'opciones' => [1 => 'SI', 0 => 'NO']
        ],
        'solicitar_vpn' => [
            'label' => 'Requiere VPN',
            'opciones' => [1 => 'SI', 0 => 'NO']
        ]
    ];
}
