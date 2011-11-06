/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Leetop.lib.AbstractApp', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: [
        'Ext.container.Viewport',

        'Leetop.lib.Desktop'
    ],

    isReady: false,
    modules: null,
    useQuickTips: true,

    constructor: function (config) {
        var me = this;
        me.addEvents(
            'ready',
            'beforeunload'
        );

        me.mixins.observable.constructor.call(this, config);

        if (Ext.isReady) {
            Ext.Function.defer(me.init, 10, me);
        } else {
            Ext.onReady(me.init, me);
        }
    },

    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }
        desktopCfg = me.getDesktopConfig();
        Ext.MessageBox.updateProgress(0.25,'25%','<br/>正在初始化桌面...');
        me.desktop = new Leetop.lib.Desktop(desktopCfg);
        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [ me.desktop ],
            listeners : {
            	'afterrender' : function(){
            		me.desktop.initView();
            		var costTime = (new Date().getTime()) - startLoadingTime;
            		Ext.MessageBox.updateProgress(1,'100%','<br/>桌面加载完成,耗时:' + costTime + 'ms');
            	}
            }
        });
		
		Ext.getBody().on('contextmenu', function(e){
        	e.stopEvent();
        });
        Ext.getBody().on('keydown', function(e){
        	var me = this;
        	if(e.getKey() == e.ESC){
        		me.onLogout();
        	}
        	else if(e.getKey() == e.F5){
        		e.stopEvent();
        		Ext.Msg.confirm('系统提示', '您确定要刷新页面么?',function(btn){
        			if(btn == 'yes'){
        				window.location.reload();
        			}
        		});
        	}
        	else if(e.getKey() == e.F1){
        		e.stopEvent();
        		Ext.Msg.alert('系统提示', '查看帮助!');
        	}
        	
        	else if(e.getKey() == e.F3){
        		e.stopEvent();
        		Ext.Msg.alert('系统提示', '查询程序!');
        	}
        	
        	else if(e.getKey() == e.O){
        		var view = me.desktop.view;
        		if(view.itemcontextmenu.isHidden() === false){
        			e.stopEvent();
        			view.onItemEnter();
        			view.itemcontextmenu.hide();
        		}
        	}
        	else if(e.getKey() == e.D){
        		var view = me.desktop.view;
        		if(view.itemcontextmenu.isHidden() === false){
        			e.stopEvent();
        			view.onItemRemove();
        			view.itemcontextmenu.hide();
        		}
        	}
        	
        	else if(e.getKey() == e.Q){
        		var view = me.desktop.view;
        		if(view.itemcontextmenu.isHidden() === false){
        			e.stopEvent();
        			view.onItemApplyToQuickStart();
        			view.itemcontextmenu.hide();
        		}
        	}
        	
        	else if(e.getKey() == e.S){
        		var view = me.desktop.view;
        		if(view.itemcontextmenu.isHidden() === false){
        			e.stopEvent();
        			view.onItemApplyToStartMenu();
        			view.itemcontextmenu.hide();
        		}
        	}
        	
        	else if(e.getKey() == e.M){
        		var view = me.desktop.view;
        		if(view.itemcontextmenu.isHidden() === false && view.itemcontextmenu.items.get(3).isDisabled() === false){
        			e.stopEvent();
        			view.onItemRename();
        			view.itemcontextmenu.hide();
        		}
        	}
        	
        	else if(e.getKey() == e.R){
        		var view = me.desktop.view;
        		if(view.itemcontextmenu.isHidden() === false && view.itemcontextmenu.items.get(6).isDisabled() === false){
        			e.stopEvent();
        			view.onItemDetail();
        			view.itemcontextmenu.hide();
        		}
        	}
        	
        	else if(e.getKey() == e.F2){
	    		e.stopEvent();
	    		me.desktop.view.onItemRename();
	    	}
	    	else if(e.getKey() == e.DELETE){
	    		e.stopEvent();
	    		me.desktop.view.onItemRemove();
	    	}
	    	else if(e.getKey() == e.UP || e.getKey() == e.DOWN || 
	    			e.getKey() == e.LEFT || e.getKey() == e.RIGHT || 
	    			e.getKey() == e.HOME || e.getKey() == e.END || 
	    			e.getKey() == e.ENTER){
	    		var key = e.getKey();
	    		e.stopEvent();
	    		var view = me.desktop.view,records = view.selModel.getSelection(),selector = view.getSelectionModel(),index;
	    		if(records.length > 0){
	    			index = view.store.indexOf(records[records.length - 1]);
	    		}else {
	    			index = -2;
	    		}
    			if( key == e.UP ){
	    			if((index - 1) >= 0 ){
	    				selector.select((index - 1));
	    			}else{
	    				selector.select(view.store.getCount() - 1);
	    			}
    			}else if(key == e.DOWN){
    				if((index + 1) <= view.store.getCount() - 1 && index + 1  > 0){
	    				selector.select((index + 1));
	    			}else{
	    				selector.select(0);
	    			}
    			}else if(key == e.LEFT || e.getKey() == e.RIGHT){
    				var rows = me.desktop.view.shortcutsCols;
    				if(e.getKey() == e.LEFT){
	    				if((index - rows) >= 0){
		    				selector.select((index - rows));
		    			}
	    			}else if(key == e.RIGHT){
	    				if((index + rows) <= view.store.getCount() - 1 && index + 1  > 0){
		    				selector.select((index + rows));
		    			}
	    			}
    			}else if(key == e.HOME){
	    			selector.select(0);
    			}else if(key == e.END){
    				selector.select(view.store.getCount() - 1);
    			}else if(key == e.ENTER){
    				view.onItemEnter();
    			}
			}
        },me);
        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.fireEvent('ready', me);
    },

    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function () {
        var me = this, cfg = {
            app: me,
            taskbarConfig: me.getTaskbarConfig()
        };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,

    /**
     * This method returns the configuration object for the Start Button. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getStartConfig: function () {
        var me = this, cfg = {
            app: me,
            menu: []
        };

        Ext.apply(cfg, me.startConfig);

        Ext.each(me.modules, function (module) {
            /*if (module.launcher) {
                cfg.menu.push(module.launcher);
            }*/
            cfg.menu.push(module);
        });

        return cfg;
    },

    /**
     * This method returns the configuration object for the TaskBar. A derived class
     * can override this method, call the base version to build the config and then
     * modify the returned object before returning it.
     */
    getTaskbarConfig: function () {
        var me = this, cfg = {
            app: me,
            startConfig: me.getStartConfig()
        };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    initModules : function(modules) {
        var me = this;
        Ext.each(modules, function (module) {
        	module.handler = function(){
        		me.createWindow(module.module,module.text);
        	};
            module.app = me;
        });
    },
    
    createWindow : function(module,text){
    	var me = this;
    	try{
    		Ext.Msg.el.fadeIn({
			    endOpacity: 1, //can be any value between 0 and 1 (e.g. .5)
			    easing: 'easeOut',
			    duration: 2000
			});
	        Ext.Msg.show({
	           title : '系统提示',
	           msg: '<br/>正在加载'+ text +'...',
	           width:300,
	           wait :true,
	           modal : false,
	           waitConfig: {interval:200},
	           icon:'ext-mb-download'
	       });
		   me.restoreMsg();
    	   var win = Ext.create(module,{app : me}).createWindow();
		   if (win) {
	            me.desktop.restoreWindow(win);
	       }
	       Ext.Msg.show({
	           title : '系统提示',
	           msg: text +'加载成功!',
	           width:300,
	           modal : false,
	           icon:Ext.MessageBox.INFO,
	           buttons : Ext.Msg.OK
	        });
	       Ext.Msg.toFront();
	       me.restoreMsg();
	    }catch(e){
	    	Ext.Msg.show({
	           title : '系统提示',
	           msg: '加载'+ (text ? text : '') +'失败!</br>详细信息：'+ (e.msg.indexOf('404') > 0 ? '加载远程JavaScript文件失败!' : e.msg),
	           width:300,
	           modal : false,
	           icon:Ext.MessageBox.ERROR,
	           buttons : Ext.Msg.OK
	        });
	    	me.restoreMsg();
	    }finally{
	    	/*Ext.Msg.el.on('mouseover',function(){
	    		Ext.Msg.el.stopFx();
	    		Ext.Msg.el.fadeIn({
				    endOpacity: 1, //can be any value between 0 and 1 (e.g. .5)
				    easing: 'easeOut',
				    duration: 2000
				});
				Ext.Msg.el.un('mouseover');
	    	});
	    	Ext.Msg.el.on('mouseout',function(){
	    		Ext.Msg.el.fadeOut({
				    endOpacity: 0, //can be any value between 0 and 1 (e.g. .5)
				    easing: 'easeOut',
				    duration: 1000
				});
				Ext.Msg.el.un('mouseout');
	    	});
	    	window.setTimeout(function(){
	    		Ext.Msg.el.fadeOut({
				    endOpacity: 0, //can be any value between 0 and 1 (e.g. .5)
				    easing: 'easeOut',
				    duration: 2000
				});
				//Ext.Msg.hide();
		    },1000);*/
	    	
	    	window.setTimeout(function(){
	    		/*Ext.Msg.el.fadeOut({
				    endOpacity: 0, 
				    easing: 'easeOut',
				    duration: 2000
				});*/
				Ext.Msg.hide();
		    },3000);
	    }
    },
    
    restoreMsg : function(){
       var me = this;
       var x = me.desktop.getWidth() - 300 - 15;
       var y = me.desktop.getHeight() - me.desktop.taskbar.getHeight() - Ext.MessageBox.getHeight() - 8;
       Ext.MessageBox.setPagePosition(x,y);
    },

    getModule : function(name) {
    	var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                return m;
            }
        }
        return null;
    },

    onReady : function(fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },
    
    
    createSmallIconCls : function(iconCls){
    	if(!Ext.util.CSS.getRule('.'+iconCls + "-small")){
    		var rule = Ext.util.CSS.getRule('.'+iconCls);
    		if(rule){
		    	var cssText = "."+iconCls+"-small {" +
									"background: url('"+ctx+"/makeIcon?url="+rule.style.backgroundImage+"') repeat;}";
		    	Ext.util.CSS.createStyleSheet(cssText);
	    	}
    	}
    	return iconCls + "-small";
    },

    getDesktop : function() {
        return this.desktop;
    },

    onUnload : function(e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});
