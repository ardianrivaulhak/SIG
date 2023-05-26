<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Laravel\Lumen\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;
// use App\Models\Hris\Attendance;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
        Commands\ModelMakeCommand::class,
        Commands\Autosend::class,
        Commands\Getdraft::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule->everyMinute();
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('command:getdraft')->dailyAt('04:00');
        $schedule->command('command:autosend')->dailyAt('03:00');
        //$schedule->call('CertificateController@getDraftforAuto')->dailyAt('10:00');
    }
}
