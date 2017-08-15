//对song进行对象化
var $window = $(window);
var $nav = $("nav.navbar-fixed-top");
var $navList = $nav.children();
var navListNum = 0;
var $audio = $('audio');
var song = 1;
var songlist = 1;
var $playing = $("#playing");
var articleHeight = [];
var bias = [-100,-250,-100,-200];  //用于纠正滚到的最佳位置
var opct = [0.4,0.8,0.9,0.8];  //opacity节点
// var canvas = document.querySelectorAll('canvas.canvas-movee');

function adjStyle(){
    //排版优化
    if ($window.width() <= 768){
        $audio.addClass("mute");
        $("#about>div").removeClass("folded");
        skillCal();
    }
    else{
        $audio.removeClass("mute");
        $("#about>div").addClass("folded");
        $("#about>div").first().removeClass("folded");
    }
    articleHeight = new Array($("#works").offset().top,$("#music-1").offset().top,$("#about").offset().top,$("#contact").offset().top,$(document).height());
    //背景调色
    $("#background").css('height',$(document).height()+10);
    var str = 'linear-gradient(rgba(0,0,0,' + opct[0] + ') 0';
    for (var i=0;i<3;i++){
    str += ',rgba(0,0,0,' + opct[i] + ') ' + (articleHeight[i]-500) + 'px';
    str += ',rgba(0,0,0,' + opct[i+1] + ') ' + (articleHeight[i]) + 'px';
    }
    $("#background").css('background',str);
}

function skillCal(){  //skill动效
      $(".skill-bar").each(function(){
          var value = $(this).parent().attr('value')*100;
          $(this).children().animate({width:value+'%'},1000);
      })
}

function playSong(){  //播放歌曲
    if (!$audio.hasClass("mute")){
    var temp = song + 1;
    if (songlist == 1){
        $audio.attr('src','data/audio/game/'+temp+'.mp3');
    }
    else{
        $audio.attr('src','data/audio/'+temp+'.mp3');
    }
    $audio[0].play();
    $playing.addClass("rotate");
    $playing.attr('value','1');
    }
}

$(document).ready(function(){
      adjStyle();
      $window.on('resize',function(){//窗口大小响应
          adjStyle();
      });
      //滚动监听
      $window.on('scroll',function(){
        var position = $window.scrollTop();
        //导航显示/隐藏
        if (position > articleHeight[0]-200){
            $nav.
            fadeIn(500);
        }
        else{
            $nav.stop(true).hide();
        }
//        导航滚动监听
        var newNavListNum = 0;
        for (i=3;i>=0;i--){
            if (position+500>articleHeight[i]){
                newNavListNum = i+1;
                break;
            }
        }
        if (newNavListNum != navListNum){
            navListNum = newNavListNum;
            $navList.removeClass("listen");
            if (newNavListNum > 0) {   $navList.eq(newNavListNum-1).addClass("listen"); }
        }
    })
    //导航
    $("nav>span").on('click',function(){
        var value = $(this).attr('value');
        var targetHeight = articleHeight[value]+bias[value];
        $('html,body').animate({'scrollTop':targetHeight},800);
    })
    $("#down").on('click',function(){
        $('html,body').animate({'scrollTop':$("#music-2").offset().top-200},500);
    })
    //about的折叠和展开
    $("div.icon").on('click',function(){
          if ($("#about>div.folded").length == 4 && $(this).parent().hasClass("folded")){
              $("#about>div").addClass("folded");
          }
          $(this).parent().toggleClass("folded");
          //skillBar的计算
          if ($(this).parent().attr('id') == "skill"){
              skillCal();
          }
      });
    $("#about>img").on('click',function(){
          if ($("#about>div.folded").length > 0) {$("#about>div").removeClass("folded");skillCal();} else { $("#about>div").addClass("folded"); }
     });
    //音乐播放的响应
    $("#music-1>ul>li").on('click',function(){
      song = $(this).index();
      songlist = 1;
      playSong();
    });
    $("#music-2>ul>li").on('click',function(){
      song = $(this).index();
        songlist = 2;
      playSong();
    });

    $audio.bind('ended',function(){
      if (songlist == 1){
          song = (song+1) % 10;
      }
      else{
          song = (song+1) % 13;
      }
      playSong();
    });

    $playing.on('click',function(){
    if ($playing.attr('value')==1){
        $playing.removeClass("rotate");
        $playing.attr('value','0');
        $audio[0].pause();
    }
    else{
        $playing.addClass("rotate");
        $playing.attr('value','1');
        $audio[0].play();
    }
    });
    // for (var i=0;i<canvas.length;i++){
    //         moveeCanvas(canvas[i]);
    // }
})
// TODO: 部署本页面
// TODO: 有空给这个页面做加速
////////////////////////canvas functions
//
// function moveeCanvas(c){
//     var cImg = document.createElement('img');
//     cImg.setAttribute("src",c.getAttribute("src"));
//     cImg.onload = function(){
//         //object constructing
//         c['img'] = cImg;
//         c.width = window.innerWidth-10;
//         c.height = c.width*c.img.height/c.img.width;
//         var calib = c.height;
//         c['r'] = /\bright\b/i.test(c.className) || false;  //the direction of the movee
//         c['cvsRedraw'] = function(){           //redraw the Img
//             var ctx = this.getContext('2d');
//             ctx.globalCompositeOperation = "source-over";
//             ctx.clearRect(0,0,this.width,this.height);
//             ctx.drawImage(this.img,0,0,this.width,this.height);
//         }
//         c['cvsGradient'] = function(){      //transparent gradient
//         const range = 0.3;
//         var ctx = this.getContext('2d');
//         ctx.globalCompositeOperation="destination-in";
//         if (this.r){
//             var grd=ctx.createLinearGradient(this.width*range,0,this.width,0);
//             grd.addColorStop(0,"transparent");
//             grd.addColorStop(1-range,"white");
//             ctx.fillStyle=grd;
//             ctx.fillRect(this.width*range,0,this.width,this.height);
//         }
//         else{
//             var grd=ctx.createLinearGradient(0,0,this.width*(1-range),0);
//             grd.addColorStop(range,"white");
//             grd.addColorStop(1,"transparent");
//             ctx.fillStyle=grd;
//             ctx.fillRect(0,0,this.width*(1-range),this.height);
//         }
//         }
//         c['cvsClip'] =  function(t,deg){      //clip cvs while scrolling
//             var h = 70;  //heightByPercentage
//             var v = 1.5;  //velocity
//             var k = Math.sin(deg/180*3.14159);
//             var y0 = v*t / this.height * 100;
//             var y1 = y0 - h;
//             var side=100;
//             var x0 = 100 - v*t / k / this.width * 100;
//             var x1 = 100 -y1*this.height/k/this.width;
//             if (this.r) {side = 0;x0 = 100 - x0;x1 = 100 - x1;}
//             str = 'polygon('+side+'% '+y0+'%,'+x0+'% '+0+'%,'+x1+'% '+0+'%,'+side+'% '+y1+'%)';
//             this.style.clipPath = str;
//         }
//         //addListener
//         window.addEventListener('scroll',function(){
//             var t = document.body.scrollTop-c.offsetTop+calib;
//             if (t>0 && t<c.height+calib){
//                 c.cvsClip(t,17);
//             }
//         });
//         window.addEventListener('resize',function(){
//             c.width = window.innerWidth-10;
//             c.height = c.width*c.img.height/c.img.width;
//             c.cvsRedraw();
//             c.cvsGradient();
//             c.cvsClip(document.body.scrollTop-c.offsetTop+calib,17);
//         });
//         //initializing
//         c.cvsRedraw();
//         c.cvsGradient();
//         c.cvsClip(document.body.scrollTop-c.offsetTop+calib,17);
//     }
// }
