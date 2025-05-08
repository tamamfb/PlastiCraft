<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    @vite('resources/css/app.css')
    <style>
        .load {
            animation: transitionIn 1s;
        }
        @keyframes transitionIn {
            from {
                opacity: 0;
                transform: rotateX(-10deg)
            }
            to {
                opacity: 1;
                transform: rotateX(0)
            }
        }
    </style>
</head>
<body class="load">
    <div class="flex flex-col items-center justify-center min-h-screen relative p-6">
        <div class="flex flex-col items-center justify-center">
            <h1 class="font-bold mt-4 text-8xl">Web is under construction :)</h1>
        </div>
    </div>
</body>
</html>