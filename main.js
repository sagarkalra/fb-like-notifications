var main = {
    reloadTime: 30000,
    panelOpen: false,
    // function to initiate the default function calls
    init: function() {
        main.populateNotifications();
        main.setUnreadCount();
        if(main.getUnreadCount() == 0) {
            $('#notif_count').hide();
        }
        main.autoload();

        //trigger open panel
        document.getElementById('notification').addEventListener('click', main.open);

        //trigger close panel
        document.body.onclick = function(e) {
            e.stopPropagation();
            main.panelOpen = false;
            $('#panel').fadeOut();
        };
        $('#panel').click(function(e) {
            e.stopPropagation()
        });
    },
    // function to open the notification panel
    open: function(e) {
        e.stopPropagation();
        if(main.panelOpen) {
            main.panelOpen = false;
            $('#panel').fadeOut();
        }
        else {
            main.panelOpen = true;
            main.markAllNotificationsRead();
            $('#panel').fadeIn("slow", function() {
                $('#notif_count').hide();
                main.setUnreadCount();
            });
        }
    },
    // function to add a new random notification
    addNewNotification: function() {
        console.log('added one more');
        var row = main.getNotification();
        main.addNotification(row);
        main.storeNotification(row);
    },
    // function to add a given notification
    addNotification: function(record) {
        var unread = '';
        if(record.read == false) {
            unread = 'unread';
        }
        var count = main.getNotificationCount();
        var template = '<li class="i_record ' + unread + '" id="k_'+count+'">' +
            '<div class="i_image"><img src="./images/'+record.img+'.jpg" /></div>' +
            '<div class="text"><span class="i_name">' + record.name + '</span>' +
            '<span class="i_msg">' + record.msg + '.</span></div>' +
            '</li>';
        $('.panel_inner').hide().prepend(template).fadeIn();
        main.setUnreadCount();
        if($('#panel').css('display') == 'none') {
            $('#notif_count').show();
        }
        else {
            main.markAllNotificationsRead();
        }

    },
    // function to recurringly add notifications after say 30 seconds
    autoload: function() {
        setInterval(function() {
            main.addNewNotification();
        }, this.reloadTime);
    },
    // function to populate current notification from storage on page load
    populateNotifications: function() {
        if(localStorage.getItem('notify') != undefined) {
            var notify = JSON.parse(localStorage.getItem('notify'));
            notify.forEach(function(val, i){
                main.addNotification(val);
            });
        }
        else {
            main.addNewNotification();
        }
    },
    // function to store nmotification in local storage
    storeNotification: function(row) {
        var current = [];
        if(localStorage.getItem('notify') != undefined) {
            current = JSON.parse(localStorage.getItem('notify'));
            current.unshift(row);
        }
        else {
            current.unshift(row);
        }
        localStorage.setItem('notify', JSON.stringify(current));
        return;
    },
    // function to mark all notifications as read
    markAllNotificationsRead: function() {
        $('.i_record').removeClass('unread');
        if(localStorage.getItem('notify') != undefined) {
            data = JSON.parse(localStorage.getItem('notify'));
            data.forEach(function(val, i) {
                val.read = true;
            });
            localStorage.setItem('notify', JSON.stringify(data));
        }
    },
    // function to get count of unread notifications
    getUnreadCount: function() {
        return parseInt(document.getElementsByClassName('unread').length);
    },
    // function to set count of unread notifications 
    setUnreadCount: function() {
        $('.n_count').html(main.getUnreadCount());
        return;
    },
    // function to get total number of notifications
    getNotificationCount: function() {
        return parseInt(document.getElementsByClassName('i_record').length);
    },
    // function to set total number of notifications
    setNotificationCount: function() {
        $('.n_count').html(main.getNotificationCount());
        return;
    },
    // Creating random data for notification
    getNotification: function() {
        var object = {};
        var name = ['John', 'Ethan', 'Mike', 'Tom', 'Jack'];
        var msg = [
            'posted on your wall',
            'hacked your password',
            'is really doing nothing',
            'is going crazy',
            'shared a photo'
        ];
        object.img = Number(main.getRandomNumber());
        object.name = name[Number(main.getRandomNumber())];
        object.msg = msg[Number(main.getRandomNumber())];
        object.read = false;
        return object;
    },
    // generate a random number between 0 to 5
    getRandomNumber: function() {
        return Math.floor(Math.random() * (5));
    },
    // Removing data from local storage
    clear: function() {
        localStorage.removeItem('notify');
        console.log('Deleted Local Storage.')
    }

};

(function() {
    console.log('Lets begin');
    main.init();
})();