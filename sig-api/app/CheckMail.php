<?php
namespace App;
 
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
 
class CheckMail extends Mailable {
 
    use Queueable,
        SerializesModels;
 
    //build the message.
    public function build() {
        return $this->view('mail');
    }
}