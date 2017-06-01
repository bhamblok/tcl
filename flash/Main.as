package  {
	
	import flash.display.MovieClip;
	import flash.utils.*;
	import flash.events.*;
	import flash.net.*;
	import lib.Day;
	import lib.DokTransport;
	import caurina.transitions.*;
	
	public class Main extends MovieClip {
		
		public function Main() {

			// constructor code			
			const weekdays:Array = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
			var weekday = weekdays.indexOf(OPTIONS.DAY);
			var day:Day;
			var dok:Dictionary;
			var loader:URLLoader = new URLLoader();
			var today = Math.round(new Date(new Date().fullYear, new Date().month, new Date().date).time/1000);
			// today = 1488153600; // 27/02/2017
			// today = 1494979200; // 17/05/2017
			
			var startDate = today - (60*60*24)*1;
			var endDate = today + (60*60*24)*6;
			//startDate = 1440720000;
			//endDate = 1440806399;
			
			var _this = this;

			OPTIONS.XML_URL += '?from='+startDate+'&till='+endDate;
			
			if(this.header_mc) {
				if(this.header_mc.title_red) this.header_mc.title_red.text = OPTIONS.DAY;
				if(this.header_mc.title_black) this.header_mc.title_black.text = OPTIONS.DAY;
				if(this.header_mc.border_mc && (OPTIONS.DAY != weekdays[new Date().day])) this.header_mc.border_mc.visible = false;
				OPTIONS.headerHeight = 82;//this.header_mc.height;				
				OPTIONS.width = this.header_mc.width;
				if(OPTIONS.DAY=='DOKTRANSPORTEN') {
					this.header_mc.HeaderExtraText.visible = false;
					this.header_mc.border_mc.visible = false;
				}
			}

			loader.addEventListener(Event.COMPLETE, onXMLLoaded);
			loader.addEventListener(IOErrorEvent.IO_ERROR, onError);
			loader.load(new URLRequest(OPTIONS.XML_URL+'&v='+Math.random()));

			setInterval(function() {
				loader.load(new URLRequest(OPTIONS.XML_URL+'&v='+Math.random()));
			},OPTIONS.REFRESH*1000);

			// HANDLE XML
			function onXMLLoaded(e:Event):void {
				if(_this.header_mc) {					
					_this.header_mc.progress_bar.width = 1;
					Tweener.addTween(_this.header_mc.progress_bar, {width:OPTIONS.width, time:OPTIONS.REFRESH, delay: 0, transition:'linear'});
				}
				if(day && _this.contains(day)) _this.removeChild(day);
				if(dok)
					for(var b in dok)
						if(_this.contains(dok[b]))
							_this.removeChild(dok[b]);
				var myXML:XML = new XML();
				//myXML.ignoreWhite = true;
				myXML = XML(e.target.data);
				_this.loading_txt.visible = false;
				// CREATE DOCKTRANSPORT-SCREENS
				if(OPTIONS.DAY=='DOKTRANSPORTEN') {
					dok = new Dictionary();
					OPTIONS.PAGE2 = false;
					var h:Number = OPTIONS.headerHeight;
					for(var i=0; i<OPTIONS.DOK.length; i++) {
						dok[i] = new DokTransport(myXML,OPTIONS,i,h);
						if(dok[i].nrOfItems) {
							h += dok[i].h;
							_this.addChild(dok[i]);
						}
					}
				// CREATE BAANTRANSPORT-SCREENS
				} else {
					day = new Day(myXML,OPTIONS);
					_this.addChild(day);
				}
			}

			// DISPLAY ERROR ON XML-LOAD-Error
			function onError(e:IOErrorEvent):void {
				if(day && _this.contains(day)) _this.removeChild(day);
				//if(dok) for(var b in dok) _this.removeChild(dok[b]);
				if(dok)
					for(var b in dok)
						if(_this.contains(dok[b]))
							_this.removeChild(dok[b]);
				_this.loading_txt.text = 'could not load xml-file';
			}
		}
	}
	
}