document.addEventListener('DOMContentLoaded', function(){ 
    //change copyright colors
    var actualColorIndex = 0;
    var colors = ['red','blue','green', 'white'];

    var pInterval = setInterval(function() {
        let footerText = document.getElementById("footer-text")
        footerText.style.color = colors[actualColorIndex]
        actualColorIndex = actualColorIndex++ > 2 ? 0 : actualColorIndex;
    }, 1500);

    //Show love on logos
    var showLove = function(event){
        var loves = document.getElementsByClassName("love");
        for(i = 0; i < loves.length; i++){
            let love = loves[i];

            if(!love.classList.contains('showing-love')){
                love.classList.add('showing-love');
                love.style.opacity = 0;
                setTimeout(function(){
                    love.style.opacity = 0.45;
                }, 100);
                setTimeout(function(){
                    love.style.opacity = 0;
                    setTimeout(function(){
                        love.classList.remove('showing-love');
                    },400)
                }, 825);
            }
        }
    };

    var logo = document.getElementById("logo")
    logo.addEventListener('touchstart', showLove, false);
    logo.addEventListener('mouseover', showLove, false);

    //animate Audi image
    function get360AngleFromVector(v1){
        //just straight to top vector
        let v2 = {
            x: 0,
            y: 100
        };

        let cosAlpha = (v1.x*v2.x + v1.y*v2.y)/(Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2)) * Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2)));
        
        let degrees = Math.acos(cosAlpha) * 180 / Math.PI;
        degrees = v1.x > 0 ? 360 - degrees : degrees;
        
        return degrees;
    }

    function animateAudi() {
        // jesli flaga startu to obliczmamy ruchy, robimy swoje i zamykamy flage startu
        if(directionStartX != '_none' && directionStartY != '_none' && directionEndX != '_none' && directionEndY != '_none'){
            let dragVector = {
                x: directionStartX - directionEndX,
                y: directionStartY - directionEndY
            };

            let angle = get360AngleFromVector(dragVector);

            //set direction
            let justifyContentChanged = 'center';
            let alignItemsChanged = 'center';
            if(angle > 340 && angle <= 360 || angle >= 0 &&  angle <= 20){
                justifyContentChanged = 'center';
                alignItemsChanged = 'flex-start';
            }
            else if(angle > 20 && angle <= 70){
                justifyContentChanged = 'flex-end';
                alignItemsChanged = 'flex-start';
            }
            else if(angle > 70 && angle <= 110){
                justifyContentChanged = 'flex-end';
                alignItemsChanged = 'center';
            }
            else if(angle > 110 && angle <= 160){
                justifyContentChanged = 'flex-end';
                alignItemsChanged = 'flex-end';
            }
            else if(angle > 160 && angle <= 200){
                justifyContentChanged = 'center';
                alignItemsChanged = 'flex-end';
            }
            else if(angle > 200 && angle <= 250){
                justifyContentChanged = 'flex-start';
                alignItemsChanged = 'flex-end';
            }
            else if(angle > 250 && angle <= 290){
                justifyContentChanged = 'flex-start';
                alignItemsChanged = 'center';
            }
            else if(angle > 290 && angle <= 340){
                justifyContentChanged = 'flex-start';
                alignItemsChanged = 'flex-start';
            }

            if(event.target.tagName == "IMG"){
                //chrome
                var imgObj = event.target;
            }
            else if(event.target.tagName == "A"){
                //firefox
                var imgObj = event.target.getElementsByTagName("img")[0];
            }

            var origWidth = imgObj.width;
            var origHeight = imgObj.height;
            
            if(imgObj != undefined && !imgObj.classList.contains('changing-size')){
                imgObj.classList.add('changing-size');
                imgObj.style.width = origWidth+'px';
                imgObj.parentNode.parentNode.style.height = origHeight+'px';
    
                setTimeout(function(){
                    imgObj.style.width = '100px';
                    imgObj.parentNode.parentNode.style.justifyContent = justifyContentChanged;
                    imgObj.parentNode.parentNode.style.alignItems = alignItemsChanged;
                }, 10);
                setTimeout(function(){
                    imgObj.style.width = origWidth+'px';
                    setTimeout(function(){
                        imgObj.parentNode.parentNode.style.justifyContent = 'center';
                        imgObj.parentNode.parentNode.style.alignItems = 'center';
                    }, 180)

                    setTimeout(function(){
                        imgObj.parentNode.parentNode.style.height = 'auto';
                        imgObj.classList.remove('changing-size');

                        directionStartX = '_none';
                        directionStartY = '_none';
                        directionEndX = '_none';
                        directionEndY = '_none';
                    },260)
                }, 250);
            }
        }
    }

    var directionStartX = '_none';
    var directionStartY = '_none';
    var directionEndX = '_none';
    var directionEndY = '_none';

    //special animation for image drag
    var imageDragTouchStart = function(event){
        if(event.touches != undefined){
            if(event.touches[0].clientX != undefined){
                directionStartX = event.touches[0].clientX;
            }
            if(event.touches[0].clientY != undefined){
                directionStartY = event.touches[0].clientY;
            }
        }else{
            if(event.screenX != undefined){
                directionStartX = event.screenX;
            }
    
            if(event.screenY != undefined){
                directionStartY = event.screenY;
            }
        }
    };

    var imageTouchMove = function(event){
        if(directionStartX != '_none' && directionStartY != '_none'){
            if(event.touches != undefined){
                if(event.touches[0].clientX != undefined){
                    directionEndX = event.touches[0].clientX;
                }
                if(event.touches[0].clientY != undefined){
                    directionEndY = event.touches[0].clientY;
                }
            }else{
                if(event.screenX != undefined){
                    directionEndX = event.screenX;
                }
        
                if(event.screenY != undefined){
                    directionEndY = event.screenY;
                }
            }
        }
    };

    var imageDragEnd = function(event){
        if(event.screenX != undefined){
            directionEndX = event.screenX;
        }

        if(event.screenY != undefined){
            directionEndY = event.screenY;
        }

        animateAudi();
    };

    var imageTouchEnd = function(event){
        animateAudi();
    };

    var animateAudiSpecial = function(event){
        if(event.changedTouches == undefined){
            return;
        }

        event.preventDefault();

        var force = event.changedTouches[0].force;

        if(event.changedTouches[0].target.tagName == "IMG"){
            //chrome
            var imgObj = event.changedTouches[0].target;
        }
        else if(event.changedTouches[0].target.tagName == "A"){
            //firefox
            var imgObj = event.changedTouches[0].target.getElementsByTagName("img")[0];
        }

        if(imgObj != undefined){
            var forceP = document.getElementById('force-with-ya');
            forceP.innerHTML = force + '!';
        }

        // var origWidth = imgObj.width;
        // var origHeight = imgObj.height;
        
        // if(imgObj != undefined && !imgObj.classList.contains('animating-special')){
        //     imgObj.classList.add('animating-special');
        //     imgObj.style.width = origWidth+'px';
        //     imgObj.parentNode.parentNode.style.height = origHeight+'px';

        //     setTimeout(function(){
        //         imgObj.style.width = '100px';
        //         imgObj.parentNode.parentNode.style.justifyContent = justifyContentChanged;
        //         imgObj.parentNode.parentNode.style.alignItems = alignItemsChanged;
        //     }, 10);
        //     setTimeout(function(){
        //         imgObj.style.width = origWidth+'px';
        //         setTimeout(function(){
        //             imgObj.parentNode.parentNode.style.justifyContent = 'center';
        //             imgObj.parentNode.parentNode.style.alignItems = 'center';
        //         }, 180)

        //         setTimeout(function(){
        //             imgObj.parentNode.parentNode.style.height = 'auto';
        //             imgObj.classList.remove('animating-special');

        //             directionStartX = '_none';
        //             directionStartY = '_none';
        //             directionEndX = '_none';
        //             directionEndY = '_none';
        //         },260)
        //     }, 250);
        // }
    };

    function setAnimateAudiEventToObj(obj){
        obj.addEventListener('dragstart', imageDragTouchStart, false);
        obj.addEventListener('dragend', imageDragEnd, false);
        obj.addEventListener('touchstart', imageDragTouchStart, false);
        obj.addEventListener('touchmove', imageTouchMove, false);
        obj.addEventListener('touchend', imageTouchEnd, false);
        obj.addEventListener('touchforcechange', animateAudiSpecial, false);
    }

    var imageInAnchors = document.getElementsByClassName("audi-image-link");
    // ogarnąc to dla <img> wewnatrz <a> dla Firefoxa
    for(i = 0; i < imageInAnchors.length; i++){
        var imgObj = imageInAnchors[i];
        if(imgObj.getElementsByTagName("img") && !imgObj.classList.contains('audi-logo-image')){
            setAnimateAudiEventToObj(imgObj);
        }
    }

    var frontCar = document.getElementsByClassName("front-car");
    if(frontCar[0]){
        setAnimateAudiEventToObj(frontCar[0]);
    }

}, false);

$(document).ready(function() {
    //jQuery
    $('.check-audis').fadeIn(400);

    $('.check-employees').on('click',function(){
        $('.employees-table tbody').html('<tr><td class="throbber">loading</td><td><div class="loader"></div></td><td><div class="loader"></div></td></tr>');
        
        $.ajax( "//dummy.restapiexample.com/api/v1/employees" )
        .done(function(data) {
            if(data.data.length){
                let employees = data.data
                let dataString = ''
                for(i = 0; i < employees.length; i++){
                    let salary = employees[i].employee_salary/100 + ' €'
                    dataString += '<tr><td>' + employees[i].employee_name + '</td><td>' + employees[i].employee_age + '</td><td>' + salary + '</td><td>' + '</td></tr>'
                }
                $('.employees-table tbody').html(dataString);
            }
        })
        .fail(function(data) {
            console.log('fail loading data')
        })
    });

    $('.hamburger-wrapper button').on('click', function(){
        $(this).parent().siblings('ul').slideToggle('fast');
    });
});