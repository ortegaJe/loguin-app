<?php

namespace App\Services;

use App\Enums\UserProfiles;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserEntityService
{
    /**
     * Obtiene el ID de la entidad del usuario autenticado.
     *
     * @return int|null
     */
    public function getUserEntityId()
    {
        $currentUser = Auth::guard('glpi')->user();

        if (!$currentUser) {
            return redirect()->route('login');
        }

        return DB::table('glpi_profiles_users')
            ->where('users_id', $currentUser->id)
            ->whereIn('profiles_id', UserProfiles::values())
            ->value('entities_id');
    }
}