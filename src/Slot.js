const extraton = require("./Extraton");
var r;
$('#playButton').click(async function () {
    $('#log').html('');
    const manualStop = true;
    if (!extraton.isInstalled) {
        manualStop = false;
    }
    $('#numbers ul').playSpin({
        manualStop,
        onFinish: ()=>{
            $('#log').show(); 
            $('#playButton').attr('disabled',false)
        }
    });

    $('#playButton').attr('disabled', true);
    const startTime = performance.now();

    extraton.initExtraton().then(r => {
        if (r == false) {
            $('#numbers ul').stopSpin({ stopEndNums: [] });
            console.log('test')
            setTimeout(4000, ()=>{('#playButton').attr('disabled', false)});
            return;
        }
        $('#numbers ul').stopSpin({ stopEndNums: [r.f, r.s, r.t] });  
        $('#log').hide(); 
        $('#log').html(checkResult(r.f, r.s, r.t));           
    }
    )
});

function checkResult(f, s, t) {
    if (f == s || s == t || f == t) {
        return '<span style="font-size: 1.2rem">WIN!!! 😀 GRAB AND GO!</span>';
    }

    return '<span style="font-size: 1.2rem">LOSS. 😿 TRY AGAIN.</span>'
}