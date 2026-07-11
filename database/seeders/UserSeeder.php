<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@shizu-leven.com'],
            [
                'name' => 'Dr. Shizu Leven',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
