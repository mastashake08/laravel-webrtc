<?php

namespace App\Http\Controllers;
use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\Notification;

use Illuminate\Http\Request;

class CallController extends Controller
{
    //
    public function call(Request $request) {
        Notification::route('broadcast', [new Channel($request->caller_id)])
    ->notify(new \App\Notifications\StartCall($request->sdp, $request->callee_id));
        return response()->json([
            'success' => true
        ]);
    }

    public function answer(Request $request) {
        Notification::route('broadcast', [new Channel($request->caller_id)])
    ->notify(new \App\Notifications\AnswerCall($request->sdp));
        return response()->json([
            'success' => true
        ]);
    }
}
