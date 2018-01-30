Array.prototype.remove=function(obj){
    for(var i =0;i <this.length;i++){
        var temp = this[i];
        if(!isNaN(obj)){
            temp=i;
        }
        if(temp == obj){
            for(var j = i;j <this.length;j++){
                this[j]=this[j+1];
            }
            this.length = this.length-1;
        }
    }
}
//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
angular.module('app',[])
    .controller('myCtrl',['$scope','$interval',function($scope,$interval){
        //展示步骤,第几个界面
        $scope.screenNum=-1;
        //抽奖轮数,第多少轮
        $scope.lotteryRound=1;
        //标记是否正在抽奖
        $scope.isLotteryIng=false;
        //标记是否正在展示奖品
        $scope.isShowingPrize=false;
        //中奖列表
        $scope.winList={
            level1:[],
            level2:[],
            level3:[],
            level4:[]
        }
        //几等奖,几名
        $scope.prizeLevel='三等奖(6名)'
        console.log(getQueryString('round'));
        console.log(getQueryString('screen'));
        //切换背景图片
        $scope.changeBgImg=function(val){
            $('body').css('background-image',val);
        }
        //如果是直接跳转进来的,那就要直接进入抽奖界面
        if(getQueryString('round')&&getQueryString('screen')){
            $scope.screenNum=2;
            $scope.music='./assets/music/raffle2.mp3';
            $scope.changeBgImg('url(./assets/imgs/bg-lottery.jpg)');
            $scope.lotteryRound=getQueryString('round');
            if($scope.lotteryRound==2){
                $scope.prizeLevel='二等奖(4名)'
            }else if($scope.lotteryRound==3){
                $scope.prizeLevel='一等奖(2名)'
            }else if($scope.lotteryRound==4){
                $scope.prizeLevel='特等奖(1名)'
            }
        }
        //抽奖音效
        $scope.music='./assets/music/raffle.mp3';
        //抽奖效果的id
        var lotteryId;
        $scope.flashNum=0;

        //监听键盘事件
        document.addEventListener('keyup',keyUpEvent);
        function keyUpEvent(e){
            if(e.keyCode==39){
                $scope.screenNum++;
                $scope.$digest();
                if($scope.screenNum==1){
                    $interval.cancel(picActiveId);
                    $scope.changeBgImg('url(./assets/imgs/bless-tree-bg.jpg)');
                    intervalId=$interval(function(){
                        $scope.showBlessCard();
                    },300);
                }else if($scope.screenNum==2){
                    $scope.music='./assets/music/raffle2.mp3';
                    $scope.changeBgImg('url(./assets/imgs/bg-lottery.jpg)');
                }else if($scope.screenNum==3){
                    $scope.music='./assets/music/raffle.mp3';
                    $scope.changeBgImg('url(./assets/imgs/wel.jpg)');
                    inMovieStatus();
                    randomPicAcitve();
                }else if($scope.screenNum==0){
                    $scope.changeBgImg('url(./assets/imgs/wel.jpg)');
                    inMovieStatus();
                    randomPicAcitve();
                }
            }else if(e.keyCode==32&&$scope.screenNum==2){
                //如果正在抽奖,那就停止抽奖,抽出一个人
                if($scope.isShowingPrize){
                    $scope.isShowingPrize=false;
                    //移除奖品图片,
                    $('.prize-img').fadeOut(1000,function(){
                        $('.prize-img').remove();
                    });
                    //清空中奖列表
                    $('#pointMumberBless').empty();
                    $scope.lotteryRound++;
                    $scope.flashNum=0;
                    if($scope.lotteryRound==2){
                        $scope.prizeLevel='二等奖(4名)'
                    }else if($scope.lotteryRound==3){
                        $scope.prizeLevel='一等奖(2名)'
                    }else if($scope.lotteryRound==4){
                        $scope.prizeLevel='特等奖(1名)'
                    }
                    //准备开始下一轮
                    return;
                }

                //如果正在展示奖品,那就隐藏
                //如果没有达到抽奖的数量,那就继续抽,如果达到抽奖数量了,俺就展示奖品
                if($scope.lotteryRound==1){
                    if($scope.isLotteryIng){
                        $scope.isLotteryIng=false;
                        lotteryMumber();
                        //停止抽奖,抽出一个人,显示出来
                        $interval.cancel(lotteryId)
                    }else{
                        //如果当前没有在抽奖,就要判断是否要去抽奖,还是展示奖品图片
                        if($scope.winList.level1.length<6){
                            $scope.isLotteryIng=true;
                            //执行去抽奖函数
                            $scope.blessLotteryCard()
                        }else{
                            //显示中奖图片
                            $scope.isShowingPrize=true;
                            showPrizeImg();
                        }

                    }
                }else if($scope.lotteryRound==2){
                    if($scope.isLotteryIng){
                        $scope.isLotteryIng=false;
                        $interval.cancel(lotteryId)
                        lotteryMumber();
                        //停止抽奖,抽出一个人,显示出来

                    }else{
                        //如果当前没有在抽奖,就要判断是否要去抽奖,还是展示奖品图片
                        if($scope.winList.level2.length<4){
                            $scope.isLotteryIng=true;
                            //执行去抽奖函数
                            $scope.blessLotteryCard()
                        }else{
                            //显示中奖图片
                            $scope.isShowingPrize=true;
                            showPrizeImg();
                        }

                    }
                }else if($scope.lotteryRound==3){
                    if($scope.isLotteryIng){
                        $scope.isLotteryIng=false;
                        $interval.cancel(lotteryId)
                        lotteryMumber();
                        //停止抽奖,抽出一个人,显示出来
                    }else{
                        //如果当前没有在抽奖,就要判断是否要去抽奖,还是展示奖品图片
                        if($scope.winList.level3.length<2){
                            $scope.isLotteryIng=true;
                            //执行去抽奖函数
                            $scope.blessLotteryCard()
                        }else{
                            //显示中奖图片
                            $scope.isShowingPrize=true;
                            showPrizeImg();
                        }
                    }
                }else if($scope.lotteryRound==4){
                    if($scope.isLotteryIng){
                        $scope.isLotteryIng=false;
                        $interval.cancel(lotteryId)
                        lotteryMumber();
                        //停止抽奖,抽出一个人,显示出来
                    }else{
                        //如果当前没有在抽奖,就要判断是否要去抽奖,还是展示奖品图片
                        if($scope.winList.level4.length<1){
                            $scope.isLotteryIng=true;
                            //执行去抽奖函数
                            $scope.blessLotteryCard()
                        }else{
                            //显示中奖图片
                            $scope.isShowingPrize=true;
                            showPrizeImg();
                        }

                    }
                }
                //lotteryMumber();
                //showPrizeImg()
                //限制只有第三个界面,同时点击空格键才能进行抽奖
            }
        }




        //逐个显示祈福卡片
        var intervalId;
        $scope.blessCardNo=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        $scope.blessCardFlash=0;
        $scope.blessCardFlashId;
        $scope.blessCardFun=function(){
            $scope.blessCardFlashId=$interval(function(){
                $scope.blessCardFlash=Math.floor((Math.random()*23));
            },3000)
        }

        $scope.showBlessCard=function(){
            var tempNum=Math.round(Math.random()*4+1);
            if($scope.blessCardNo.length<tempNum){
                tempNum=$scope.blessCardNo.length;
                $interval.cancel(intervalId);
                $scope.blessCardFun();
                $("#bcard2").animate({'width':'45px','height':'80px'},1300);
            }
            for(var i=0;i<tempNum;i++){
                var index = Math.floor((Math.random()*$scope.blessCardNo.length));
                console.log($scope.blessCardNo[index]);
                $('#bcard'+$scope.blessCardNo[index]).fadeIn(500);
                $scope.blessCardNo.remove(index);
            }
        }

        $scope.blessLotteryCard=function(){
            lotteryId=$interval(function(){
                $scope.flashNum=Math.floor((Math.random()*23))
            },200)
        }
        //抽出中奖同事--处理抽奖结果的函数
        function lotteryMumber(){
            var index = Math.floor((Math.random()*names.persons.length));
            var pointPersion=names.persons[index];
            if($scope.lotteryRound==1){
                $scope.winList.level1.push(names.persons[index])
            }else if($scope.lotteryRound==2){
                $scope.winList.level2.push(names.persons[index])
            }else if($scope.lotteryRound==3){
                if(pointPersion.name=='鲍总'){
                    lotteryMumber();
                    return;
                }
                $scope.winList.level3.push(names.persons[index])
            }else if($scope.lotteryRound==4){
                if(pointPersion.name=='鲍总'){
                    lotteryMumber();
                    return;
                }
                $scope.winList.level4.push(names.persons[index])
            }
            names.persons.remove(index);
            dealImgScroll(pointPersion);
        }
        //展示奖品图片
        function showPrizeImg() {
            var imgStr
            if($scope.lotteryRound==1){
                imgStr='<img class="prize-img" src="./assets/prize/pen.jpeg">'
            }else if($scope.lotteryRound==2){
                imgStr='<img class="prize-img" src="./assets/prize/book.jpeg">'
            }else if($scope.lotteryRound==3){
                imgStr='<img class="prize-img" src="./assets/prize/10.jpg">'
            }else{
                imgStr='<img class="prize-img" src="./assets/prize/20.jpeg">'
            }

            $('#lotteryLeft').append(imgStr);
            $('.prize-img').fadeIn(500);
        }
        //展示卷轴
        function dealImgScroll(val){
            var imgStr='';
            if($scope.lotteryRound==1){
                imgStr='<div class="content">';
            }else if($scope.lotteryRound==2){
                imgStr='<div class="content margin-top2">';
            }else if($scope.lotteryRound==3){
                imgStr='<div class="content margin-top3">';
            }else if($scope.lotteryRound==4){
                imgStr='<div class="content margin-top4">';
            }


            imgStr=imgStr+'<div class="l-pic-index"></div>'+
                '<div class="r-pic-index"></div>'+
                '<div class="l-bg-index"></div>'+
                '<div class="r-bg-index"></div>'+
                '<div class="main-index">'+
                '千门万户曈曈日,总把新桃换旧符'+
                '</div>'+
                    '<img src="./assets/photos/'+val.pic+'">'+
                '</div>'
            $('#pointMumberBless').append(imgStr);
            $(".l-pic-index").animate({'left':'-27px','top':'-3px'},1450);
            $(".r-pic-index").animate({'right':'-27px','top':'-3px'},1450);
            $(".l-bg-index").animate({'width':'200px','left':'0px'},1500);
            $(".r-bg-index").animate({'width':'200px','right':'0px'},1500,function(){
                $(".main-index").fadeIn(800);
            });
        }


        var picActiveId
        function randomPicAcitve(){
            picActiveId=$interval(function(e){
                var imgClassId=Math.floor((Math.random()*20))
                inMovieStatus('.img-animate'+imgClassId)
            },5000)
        }

        //图片批量进入效果
        function inMovieStatus(val) {
            var myResult;
            if(val){
                myResult=$(val);
            }else{
                myResult=$("img");
            }
            myResult.each(function(){
                d = Math.random()*1000; //1ms to 1000ms delay
                $(this).delay(d).animate({opacity: 0.1}, {
                    //while the thumbnails are fading out, we will use the step function to apply some transforms. variable n will give the current opacity in the animation.
                    step: function(n){
                        s = 1-n; //scale - will animate from 0 to 1
                        $(this).css("transform", "scale("+s+")");
                    },
                    duration: 900,
                })
            }).promise().done(function(){
                //after *promising* and *doing* the fadeout animation we will bring the images back
                if(val){
                    storm(val);
                }else{
                    storm();
                }

            })
        }

        //storm();
        function storm(val){
            console.log(val);
            var myTempRsult;
            if(val){
                myTempRsult=$(val);
            }else{
                myTempRsult=$("img");
            }

            myTempRsult.each(function(){
                d = Math.random()*1000;
                $(this).delay(d).animate({opacity: 1}, {
                    step: function(n){
                        //rotating the images on the Y axis from 360deg to 0deg
                        ry = (1-n)*600;
                        //translating the images from 1000px to 0px
                        tz = (1-n)*300;
                        tx = (1-n)*100;
                        //applying the transformation
                        $(this).css("transform", "rotateX("+tx+"deg) rotateY("+ry+"deg) translateZ("+tz+"px)");
                    },
                    duration: 2000,
                    //some easing fun. Comes from the jquery easing plugin.
                    easing: '',
                })
            })
        }
        // $('.img-animate10').animate({
        //     height:500,
        //     width:600
        // },{
        //     easing: 'easeInOutQuad',
        //     duration: 1500,
        //     complete: function(){
        //         console.log('complate')
        //     }
        // });
    }])
