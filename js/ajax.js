var request;
var $gif = $("#gif");
var $current = $gif;
var $currentThumb;
var cache = {};
var $frame = $('#content');
var $thumbs = $("#works>div").not(".line").not(".title").not(".empty").not(".web");
var $detail = $("#detail");
var $close = $("#close");
var $prev = $("#prev");
var $next = $("#next");
var index;
var opened = false;

function picFade($img){  //切换/显示图片
    if ($current) {
        $current.stop().fadeOut('slow');
    }
    $img.css({
        marginLeft:-$img.width()/2,
        marginTop:-$img.height()/2
    });
    
    $img.stop().fadeTo('slow',1);
    $current = $img;
}


$(document).keydown(function(e){ //键盘翻页控制
        //27 esc
        //37 <-
        //39 ->
    if (opened == true){
    if (e.keyCode == 37)    {$prev.click();}
    if (e.keyCode == 39)    {$next.click();}
    if (e.keyCode == 27)    {$close.click();}
    }
});


$prev.on('click',function(){   //向前
        index=$thumbs.index($currentThumb);
        index = Math.max(0,index - 1);
        $thumbs.eq(index).click();
});
$next.on('click',function(){   //向后
        index=$thumbs.index($currentThumb);
        index = Math.min($thumbs.length,index + 1);
        $thumbs.eq(index).click();
});
$close.on('click',function(){  //关
        opened = false;
        $detail.addClass("hide");
        $current.stop().fadeOut('slow');
        $current = $gif;
});
$thumbs.on('click',function(e){  //打开
        var $img;
        opened = true;
        $currentThumb = $(this);
        var id = $currentThumb.attr('id'); 
        request = id;
        index=$thumbs.index($currentThumb);
        $prev.removeClass("invisible");
        $next.removeClass("invisible");
        if (index===0){
            $prev.addClass("invisible");
        }
        if (index===$thumbs.length-1){
            $next.addClass("invisible");
        }
        var tmp = index+1;
        $("#num").text(tmp+'/'+$thumbs.length);
        e.preventDefault();
        $detail.removeClass("hide");
        if (cache.hasOwnProperty(id)){
            if (cache[id].isLoading === false){
                picFade(cache[id].$img)
            }
        }else{
            $img = $('<img/>');
            cache[id] = {
                $img:$img,
                isLoading: true
            };
            
            $img.on('load',function(){
                $img.hide();
                $frame.removeClass("loading").append($img);
                cache[id].isLoading = false;
                if(request === id){
                    picFade($img);
                }
            });
            
            $frame.addClass('loading');
            $img.attr({
                'src':'data/' + id + '.jpg',
                'alt':''
            });
        }
        
});