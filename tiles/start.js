var setTilesAreaSize = function(){
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var groups = $(".tiles-group");
    var tileAreaWidth = 80;
    $.each(groups, function(){
        if (width <= Metro.media_sizes.LD) {
            tileAreaWidth = width;
        } else {
            tileAreaWidth += $(this).outerWidth() + 80;
        }
    });

    $(".tiles-area").css({
        width: tileAreaWidth
    });

    if (width > Metro.media_sizes.LD) {
        $(".start-screen").css({
            overflow: "auto"
        })
    }
};

setTilesAreaSize();


$.each($('[class*=tile-]'), function(){
    var tile = $(this);
    setTimeout(function(){
        tile.css({
            opacity: 1,
            "transform": "scale(1)",
            "transition": ".3s"
        }).css("transform", false);

    }, Math.floor(Math.random()*500));
});

$(".tiles-group").animate({
    left: 0
});

$(window).on(Metro.events.resize + "-start-screen-resize", function(){
    setTilesAreaSize();
});

$(window).on(Metro.events.mousewheel, function(e){
    var up = e.originalEvent.deltaY < 0 ? -1 : 1;
    var scrollStep = 50;
    $(".start-screen")[0].scrollLeft += scrollStep * up;
});

var Desktop = {
    options: {
        windowArea: ".window-area",
        windowAreaClass: "",
        taskBar: ".task-bar > .tasks",
        taskBarClass: ""
    },

    wins: {},

    setup: function(options){
        this.options = $.extend( {}, this.options, options );
        return this;
    },

    addToTaskBar: function(wnd){
        var icon = wnd.getIcon();
        var wID = wnd.win.attr("id");
        var item = $("<span>").addClass("task-bar-item started").html(icon);

        item.data("wID", wID);

        item.appendTo($(this.options.taskBar));
    },

    removeFromTaskBar: function(wnd){
        console.log(wnd);
        var wID = wnd.attr("id");
        var items = $(".task-bar-item");
        var that = this;
        $.each(items, function(){
            var item = $(this);
            if (item.data("wID") === wID) {
                delete that.wins[wID];
                item.remove();
            }
        })
    },

    createWindow: function(o){
        o.onDragStart = function(){
            win = $(this);
            $(".window").css("z-index", 1);
            if (!win.hasClass("modal"))
                win.css("z-index", 3);
        };
        o.onDragStop = function(){
            win = $(this);
            if (!win.hasClass("modal"))
                win.css("z-index", 2);
        };
        o.onWindowDestroy = function(win){
            Desktop.removeFromTaskBar($(win));
        };

        var w = $("<div>").appendTo($(this.options.windowArea));
        var wnd = w.window(o).data("window");

        var win = wnd.win;
        var shift = Metro.utils.objectLength(this.wins) * 16;

        if (wnd.options.place === "auto" && wnd.options.top === "auto" && wnd.options.left === "auto") {
            win.css({
                top: shift,
                left: shift
            });
        }
        this.wins[win.attr("id")] = wnd;
        this.addToTaskBar(wnd);

        return wnd;
    }
};

Desktop.setup();

function createWindowCalendar(){
    Desktop.createWindow({
        resizeable: false,
		resizable: false,
        draggable: true,
		btnMax: false,
        width: 282,
        icon: "<span class='mif-calendar'></span>",
        title: "日历",
        content: "<div data-resizable=\"false\" data-role=\"calendar\" data-locale=\"cn-ZH\"></div>",
        clsContent: "bg-dark"
    });
}
