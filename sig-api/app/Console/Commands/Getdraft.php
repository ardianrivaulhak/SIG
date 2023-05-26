<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Analysis\CertificateController;

class Getdraft extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:getdraft';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'auto get draft';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $x = new CertificateController(); 
        echo $x->getDraftforAuto();
    }
}
