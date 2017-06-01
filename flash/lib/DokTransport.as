package lib {
	
	import flash.display.Sprite;
	import flash.utils.Dictionary;
	import lib.Card;
	import lib.Row;
			
	public class DokTransport extends Sprite {
		
		private const conditions:Object = {
			STATUS2: ['TELADEN','PROG'],
			ACTIVITEIT: ['DOKTRANSPORT','PARKING','GARAGE']
		};
		
		var groupBy:Dictionary = new Dictionary();
		const weekdays:Array = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

		public var h: int = 0;
		public var nrOfItems: int = 0;

		public function DokTransport(myXML,OPTIONS,i,y) {

			var _this = this;
			
			var status2 = OPTIONS.DOK[i].STATUS2;
			var extraStatus = 'NOSTATUS';
			var title = OPTIONS.DOK[i].TITLE;
			if(status2 && !title) title = status2;
			if(title=='CHASSIS') {
				status2 = 'GARAGE';
				extraStatus = 'PARKING';
			}

			var dokSectionHeader = new DokSectionHeader();
			dokSectionHeader.title_txt.text = title;
			dokSectionHeader.x = 0;
			dokSectionHeader.y = 0;
			
			this.addChild(dokSectionHeader);
			this.h = dokSectionHeader.height;

			this.y = y;
			
			var card:Card;
			for each(var item:XML in myXML.ttplanning) {
				
				if(item.ACTIVITEIT=='') item.ACTIVITEIT = 'PARKING';
				
				if(status2 && (item.STATUS2!=undefined) &&
					(item.STATUS2.toUpperCase()==status2 || item.STATUS2.toUpperCase()==extraStatus) &&
					(item.STATUSCODE!='REF') &&
					(conditions.ACTIVITEIT.indexOf(item.ACTIVITEIT.toUpperCase())!=-1)) {
						
					var chassis = (['GARAGE','PARKING'].indexOf(item.ACTIVITEIT.toUpperCase())!=-1);
					// check if this is NOT a "chassis"-item, or it IS a "chassis"-item having also an chassis-number
					if(!chassis || (item.Trailer_Fleet_Number!='')) {

						card = new Card(item,status2,true,myXML);
						_this.nrOfItems++;
							
						if(!this.groupBy[card.groupBy]) {
							groupBy[card.groupBy] = new Row(card,5);
							groupBy[card.groupBy].x = 0;
							this.addChild(groupBy[card.groupBy]);
						} else {
							groupBy[card.groupBy].addCard(card, false);
						}
					}
				}
			}
		
			// Sort dictionary by its Key
			function sortDictionaryKeys(d:Dictionary):Array {
				var a:Array = new Array();
				for (var dictionaryKey:Object in d)
					a.push(dictionaryKey);
				a.sort(function(a,b):int{
					if(!isNaN(a) && !isNaN(b)) {
						return Number(a)-Number(b);
					} else if(!isNaN(a) && isNaN(b)) return -1;
					else if(isNaN(a) && !isNaN(b)) return 1;
					else {
						if(a.toLowerCase()>b.toLowerCase()) return 1;
						else if(a.toLowerCase()<b.toLowerCase()) return -1;
						else return 0;
					}
					return 0;
				});
				return a;
			}
			// set Y of each row
			function setY(rows):void {
				var sortedArray:Array = sortDictionaryKeys(rows),
					y = _this.h;
				
				for(var i:int=0; i<sortedArray.length; i++) {
					rows[sortedArray[i]].setMultipleRows(5);
					if(_this.y+_this.h+rows[sortedArray[i]].h>1920 && !OPTIONS.PAGE2) {
						OPTIONS.PAGE2 = true;
						y += OPTIONS.headerHeight+(1920-(_this.h+_this.y));
						_this.h += OPTIONS.headerHeight+(1920-(_this.h+_this.y));
					}

					rows[sortedArray[i]].y = y;
					y += rows[sortedArray[i]].h;					
					_this.h += rows[sortedArray[i]].h;

				}
				
			}
			setY(groupBy);
			
			if(OPTIONS.PAGE==2) this.y-=1920;
		}
	}
}