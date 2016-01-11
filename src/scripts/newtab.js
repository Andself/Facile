'use strict';

var Facile = (function(moment) {
    var timer;

    /**
     * 获得菜单栏链接对象
     * @return {object} 菜单栏链接对象
     */
    var init = function() {
        return {
            bookmarks: document.querySelector('[data-item="bookmarks"]'),
            time: document.querySelector('[data-item="time"]'),
            apps: document.querySelector('[data-item="apps"]'),
        };
    };

    /**
     * 清除Time页面计时器
     * @param {number} timer 定时器ID
     */
    var clearTimer = function(timer) {
        if(typeof timer !== 'undefined') {
            clearInterval(timer)
        }
    };

    /**
     * 显示对象div，隐藏其他div
     * @param  {string} data 对象div的data-block属性值
     */
    var show = function(data) {
        var main = document.querySelectorAll('[data-block]');
        var element = document.querySelector('[data-block=' + data + ']');
        for(var i = 0; i < main.length; i++) {
            if(main[i] === element) {
                main[i].style.display = 'block';
            } else {
                main[i].style.display = 'none';
            }
        }
    };

    /**
     * 书签功能初始化
     */
    var bookmarks = function() {
        show('bookmarks');
        clearTimer(timer);

        /**
         * 创建书签节点页面
         * @param  {array} bookmarks 包含节点书签数据的数组
         */
        var newBookmarks = function(bookmarks, flag) {
            var element = document.querySelector('[data-block="bookmarks"]');
            var bookmarks = bookmarks;
            var html = [];
            var ul = document.createElement('ul');
            if(!flag) {
                var backLi = document.createElement('li');
                var backA = document.createElement('a');
                backA.innerHTML = '<i class="icon-back"></i>Top';
                backA.onclick = function() {
                    chrome.bookmarks.getTree(function(bookmarks) {
                        newBookmarks(bookmarks[0].children[0].children, true);
                    });
                };
                backLi.appendChild(backA);
                ul.appendChild(backLi);
            }

            for(var key in bookmarks) {
                var bookmark = bookmarks[key];
                var li = document.createElement('li');
                var a = document.createElement('a');

                if(!bookmark.hasOwnProperty('url')) {
                    a.innerHTML = '<i class="icon-folder"></i>' + bookmark.title;
                    (function(bookmark) {
                        a.onclick = function() {
                            chrome.bookmarks.getSubTree(bookmark.id, function(bookmarks) {
                                newBookmarks(bookmarks[0].children, false);
                            });
                        };
                    })(bookmark);
                } else {
                    a.innerHTML = '<i class="icon-bookmark"></i>' + bookmark.title;
                    if(bookmark.url === 'chrome://bookmarks/') {
                        a.onclick = function() {
                            chrome.tabs.create({
                                url: 'chrome://bookmarks/'
                            });
                        };
                    } else {
                        a.innerHTML = '<img src="chrome://favicon/' + bookmark.url + '">' + bookmark.title;
                        a.href = bookmark.url;
                    }
                }
                li.appendChild(a);
                ul.appendChild(li);
            }
            element.innerHTML = '';
            element.appendChild(ul);
        };
        chrome.bookmarks.getTree(function(bookmarks) {
            newBookmarks(bookmarks[0].children[0].children, true);
        });
    };

    /**
     * 时间功能初始化
     */
    var time = function() {
        show('time');
        clearTimer(timer);
        var newTime = function() {
            var element = document.querySelector('[data-block="time"]');
            element.innerHTML = ['<h1>','</h1>'].join(moment().format('HH:mm')) +
                             ['<h2>','</h2>'].join(moment().format('MMM Do'));
        };
        newTime();
        timer = setInterval(function() {
            newTime();
        }, 1000);
    };

    /**
     * 应用功能初始化
     */
    var apps = function() {
        show('apps');
        clearTimer(timer);
        var element = document.querySelector('[data-block="apps"]');
        var ul = document.createElement('ul');
        chrome.management.getAll(function(apps) {
            for(var i = 0; i < apps.length; i++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                var app = apps[i];
                if(app.isApp) {
                    var icons = app.icons;
                    icons.reverse();
                    a.innerHTML = '<img src="' + icons[0].url + '">' + app.name;
                    (function(app) {
                        a.onclick = function() {
                            chrome.management.launchApp(app.id, function(app) {
                                console.log(app);
                            });
                        };
                    })(app);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            }
        });
        element.innerHTML = '';
        element.appendChild(ul);
    };

    return {
        init: init,
        bookmarks: bookmarks,
        time: time,
        apps: apps
    }
})(moment);

;(function() {
    Facile.time();
    var facile = Facile.init();
    facile.bookmarks.onclick = function() {Facile.bookmarks()};
    facile.time.onclick = function() {Facile.time()};
    facile.apps.onclick = function() {Facile.apps()};
})();
