<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    @vite('resources/css/app.css')
</head>
<body>
    <div class="flex flex-col items-center justify-center min-h-screen relative p-6">
        <div class="flex flex-col items-center justify-center">
            <img src="{{ asset('storage/logo.png') }}" alt="Gambar" class="w-48">
            <h1 class="font-bold mt-4 text-4xl">PlastiCraft</h1>
        </div>
        
        <h1 class="italic text-2xl absolute bottom-20">by RTR</h1>
    </div>

    <script>
    setTimeout(function() {
        window.location.href = "{{ url('/home') }}";
    }, 3000);
    </script>
</body>
</html>