<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import  InputLabel  from '@/Components/InputLabel.vue';
import  TextInput  from '@/Components/TextInput.vue';
import {onMounted, ref} from 'vue'
const props = defineProps({
    callerId: {
        type: String,

    },
    canLogin: {
        type: Boolean,

    },
    canRegister: {
        type: Boolean,

    }
})
const hasStream = ref(false);
const pc = new RTCPeerConnection();
pc.createDataChannel(props.callerId);
pc.oniceconnectionstatechange = () => {
  if (pc.iceConnectionState === "failed") {
    pc.restartIce();
  }
};
pc.onnegotiationneeded = async () => {
  try {
    await pc.setLocalDescription();
    //signaler.send({ description: pc.localDescription });
  } catch (err) {
    console.error(err);
  } finally {
  }
};
const stream = ref(null);
const grantPermissions = async (evt, constraints = {
    video: {
      width: { min: 640, ideal: 1920 },
      height: { min: 400, ideal: 1080 },
      aspectRatio: { ideal: 1.7777777778 },
    },
    audio: {
      sampleSize: 16,
      channelCount: 2,
    }}) => {
    try {
    stream.value= await navigator.mediaDevices.getUserMedia(constraints);
    for (const track of stream.value.getTracks()) {
        pc.addTrack(track, stream.value);
    }
    const video = document.getElementById('callee_video');
    video.srcObject = stream.value
    video.play()
    hasStream.value = true
    /* use the stream */
  } catch (err) {
    /* handle the error */
    console.log(err)
  }
}
const form = useForm({
    caller_id: '',
    sdp: {}
});

const submit = async () => {
    form.sdp = await pc.createOffer();
    await pc.setLocalDescription(form.sdp);
    await fetch('/api/call', {
        method: 'POST',
        body: JSON.stringify({
            sdp:form.sdp,
            caller_id: form.caller_id,
            callee_id: props.callerId
        }),
        headers: {
           'Content-Type': 'application/json',
           // 'X-CSRF-TOKEN': usePage().props.value.csrf
           // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

const answer = async (caller_id) => {

    const sdp = await pc.createAnswer();

    await pc.setLocalDescription(sdp);
   await fetch('/api/answer', {
        method: 'POST',
        body: JSON.stringify({
            sdp: sdp,
            caller_id: caller_id
        }),
        headers: {
           'Content-Type': 'application/json',
           // 'X-CSRF-TOKEN': usePage().props.value.csrf
           // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};
pc.ondatachannel = (e) => {
    console.log('New data channel', e)
}
pc.ontrack = (e) => {
    ;
    const video = document.getElementById('caller_video');
    video.srcObject = e.streams[0]
    video.play()
}
onMounted(() => {

    Echo.channel(props.callerId)
    .notification( async (notification) => {

        switch(notification.type) {
            case "App\\Notifications\\StartCall":
            const session = notification.sdp;
            session.sdp += "\n";
            pc.setRemoteDescription(session);

            await answer(notification.caller_id)

            break;
            case "App\\Notifications\\AnswerCall":
            const sdp = notification.sdp;
            sdp.sdp += "\n";
            pc.setRemoteDescription(sdp);

        }
    });
})

</script>

<template>
    <Head title="WebRTC Laravel Echo Demo" />
    <div class="min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300 flex flex-col justify-center items-center">
        <!-- Background Image -->
        <img
            id="background"
            class="absolute -left-20 top-0 max-w-[877px] opacity-20 dark:opacity-30"
            src="https://laravel.com/assets/img/welcome/background.svg"
            alt="Background Pattern"
        />

        <!-- Main Container -->
        <div class="relative w-full max-w-4xl px-6 lg:max-w-6xl">
            <!-- Header -->
            <header class="flex flex-wrap items-center justify-between py-6">
                <!-- Logo -->
                <div class="flex justify-center w-full lg:w-auto">
                    <svg class="h-12 text-red-500 dark:text-white lg:h-16" viewBox="0 0 62 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Laravel Logo -->
                        <path d="..." fill="currentColor" />
                    </svg>
                </div>

                <!-- Navigation -->
                <nav v-if="canLogin" class="flex space-x-4">
                    <Link v-if="$page.props.auth.user" :href="route('dashboard')" class="px-4 py-2 rounded-md text-gray-900 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-800">
                        Dashboard
                    </Link>

                    <template v-else>
                        <Link :href="route('login')" class="px-4 py-2 rounded-md text-gray-900 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-800">
                            Log in
                        </Link>

                        <Link v-if="canRegister" :href="route('register')" class="px-4 py-2 rounded-md text-gray-900 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-800">
                            Register
                        </Link>
                    </template>
                </nav>
            </header>

            <!-- Main Content -->
            <main class="flex flex-col items-center justify-center mt-8">
                <div class="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-xl text-center">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Laravel WebRTC Echo Example
                    </h2>
                    <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Simple Laravel WebRTC Example Utilizing Vue, Laravel Echo, and Laravel Reverb.
                    </p>
                    <p class="mt-2 font-semibold">Your caller ID is: {{ callerId }}</p>

                    <!-- Caller ID Form -->
                    <form @submit.prevent="submit" class="mt-4 w-full">
                        <InputLabel value="Input Caller ID" for="caller_id" class="block w-full text-left" />
                        <TextInput id="caller_id" v-model="form.caller_id" class="w-full mt-2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <PrimaryButton class="mt-2 w-full">
                            Call
                        </PrimaryButton>
                    </form>

                    <!-- Permission Button -->
                    <PrimaryButton v-if="!hasStream" @click="grantPermissions" class="mt-4 w-full">
                        Grant Permissions
                    </PrimaryButton>

                    <!-- Video Containers -->
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <video id="caller_video" class="w-full border rounded-md shadow-md"></video>
                        <video id="callee_video" class="w-full border rounded-md shadow-md" muted></video>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                <a href="https://jyroneparker.com" target="_blank" class="hover:underline">
                    Created by Jyrone Parker
                </a>
            </footer>
        </div>
    </div>
</template>
