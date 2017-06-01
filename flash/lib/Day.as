package lib {
	
	import flash.display.Sprite;
	import flash.utils.Dictionary;
	import lib.Card;
	import lib.Row;
	
	public class Day extends Sprite {
		
		private const trucks:Array = [
			//'104',
			//'105',
			//'107',
			//'108',
			//'120',
			'121',
			//'122',
			'123',
			'124',
			'125',
			'126',
			'127',
			'128',
			'129',
			'130',
			'131',
			'133',
			'134',
			'135',
			'136',
			'137',
			'138',
			'139',
			'140',
			'141',
			'142',
			'143',
			'144',
			'145',
			'146',
			'147',
			'148',
			'149',
			'150'
		];
		
		// LINKER KOLOM
		private const planProg:Object = {
			STATUSCODE: ['PLAN','PROG','NOTOP'],
			ACTIVITEIT: [
				'BAANTRANSPORT',
				'DOKTRANSPORT',
				'VERLOF',
				'ZIEKTE',
				'GARAGE',
				//'FOUTVRACHT',
				'ANNULATIE',
				'ARBEIDSONGESCHIKT',
				'ARBEIDSONGEVAL',
				'ECONOMISCH WERKLOOS',
				'DOK'//,
				//'RESERVATIE'
			]
		};
		
		// RECHTER 2 KOLOMMEN
		private const newAccPrior1:Object = {
			STATUSCODE: ['NEW','ACC'],
			STATUS2: ['OP TE HALEN', 'TE LADEN', 'TE LOSSEN', 'DOUANE'],
			ACTIVITEIT: ['BAANTRANSPORT']
		};
		
		private var rowsCol1:Dictionary = new Dictionary();
		private var rowsVerlofZiekte:Dictionary = new Dictionary();
		private var rowsCol2:Dictionary = new Dictionary();
		private var rowsCol3:Dictionary = new Dictionary();
				
		const weekdays:Array = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
		
		public function Day(myXML,OPTIONS) {
			// check date (day of week for this file)
			function checkDate(item:XML,prop:String) {
				var dateString:String = (item[prop]!=undefined?item[prop]:(item.ttplanningdet[prop]!=undefined?item.ttplanningdet[prop]:''));				
				if( dateString == '' ) return false;
				var itemDate:Date;
				var datePattern : RegExp = /(\d{4})-(\d+)-(\d+)( (\d+):(\d+):(\d+))?/;
				var result : Object = datePattern.exec( dateString );
				if( result[ 4 ] != null ) itemDate = new Date( result[1], result[2] - 1, result[3], result[ 5 ], result[ 6 ], result[ 7 ] );
				else itemDate = new Date( result[1], result[2] - 1, result[3] );
				return OPTIONS.DAY == weekdays[itemDate.day];
			}

			// check conditions
			function checkConditions(item:XML,conditions) {
				var valid = true;
				for(var cond:String in conditions) {
					if(conditions[cond].indexOf(String(item[cond]).toUpperCase())==-1) valid = false;
				}
				return valid;
			}
			
			//function checkIfCardDossierAlreadyExists(cardToCheck) {
				//for each(var existing:Card in this.rowsCol2) {
				//	trace(existing.id);
				//}
				//for (var dictionaryKey:Object in d)
				//trace(this.rowsCol2.length);
				//for(var i=0; i<this.rowsCol2.length; i++) {
				//	var existing = Card(this.rowsCol2[i]);
				//	trace(existing.Intermodal_FINAC_Analytic_Code);
				//}
				//return false;
			//}

			var col1:int = 0;
			var col2:int = 0;
			var col3:int = 0;
			var card:Card;
			for each(var item:XML in myXML.ttplanning) {
				
				// check if this is a reservation for a charter
				var charter = checkDate(item,'Date_active') &&
								(item.STATUS2.toUpperCase()==='RESERVATIE') &&
								//(isNaN(item.Truck_Fleet_Number.split(' ')[0]) || (!isNaN(item.Truck_Fleet_Number))) &&
								(item.Truck_Fleet_Number.indexOf('RESERVATIE')==-1);
				
				// check if this is a DOK
				var dok = checkDate(item,'Date_active') && item.STATUS2.toUpperCase()==='DOK';

				// STATUS = [PLAN|PROG] && Date_active = TODAY || extern charter || DOK
				if((checkConditions(item,planProg) && checkDate(item,'Date_active')) || charter || dok) {//||// && checkDate(item,'DATPLAN')) ||
					card = new Card(item,'TIMEREQ',false, myXML);
					var truck = card.truck.split(' ')[0];
				
					// if activiteit = Baantransport or Doktransport while there is NO chauffeur, DON't show it
					var chauffeur = ((item.CHAUFFEUR!='') || (['BAANTRANSPORT','DOKTRANSPORT'].indexOf(card.activity)==-1));
					var foutvracht = (item.STATUS2.toUpperCase() == 'FOUTVRACHT');
					
					if(!foutvracht && card.display && !card.oldNOTOP && chauffeur && (truck || (['GARAGE','PARKING'].indexOf(card.activity)==-1))) {
						
						if(!this.rowsCol1[truck]) {
							card.showTruck();
							this.rowsCol1[truck] = new Row(card,3);
							this.rowsCol1[truck].x = 0;
							this.addChild(this.rowsCol1[truck]);
						} else {
							this.rowsCol1[truck].addCard(card, true);
						}
					}
				}
				
				// STATUS = [NEW|ACC] && PLANNING_DATE = TODAY && PRIOR = 1/4				
				else if((checkConditions(item,newAccPrior1) || (item.STATUS2.toUpperCase()==='RESERVATIE')) && checkDate(item,'Date_active')) {
					//card = new Card(item,'(UN)LOADING_TIME',false);
					card = new Card(item,'TIMEREQ',false, myXML);
					var key:String = '';
					
					var dossier = false; //checkIfCardDossierAlreadyExists(card);

					//if(item.ADRES == 'Battice') trace('NOOOO');
					if (!card.hideCustoms && !dossier) {
						

						// PUT HUB-CARDS IN A SEPARATE ROW, BACK IN COL 1!
						if ((item.Action_From_QPAR == 'CHUB' || item.Action_From_QPAR == 'CHUB2') && item.Action_To_QPAR == 'TURNIN') {
							if (!this.rowsCol1[card.truck]) {								
								card.showTruck();
								this.rowsCol1[card.truck] = new Row(card,3);
								this.rowsCol1[card.truck].x = 0;
								this.addChild(this.rowsCol1[card.truck]);
							}
							this.rowsCol1[card.truck].addCard(card, true);
						}
						
						
						else if(((item.PRIOR!='') && (item.PRIOR=='1' || item.PRIOR=='4')) || (card.timereq>0 && card.timereq<12)) {
							key = (card.timereq<10?'0':'')+card.timereq+'-'+col2++;
							this.rowsCol2[key] = new Row(card,2);
							this.rowsCol2[key].x = OPTIONS.width-card.w*2;
							this.addChild(this.rowsCol2[key]);
						} else {
							key = (card.timereq<10?'0':'')+card.timereq+'-'+col3++;
							this.rowsCol3[key] = new Row(card,2);
							this.rowsCol3[key].x = OPTIONS.width-card.w;
							this.addChild(this.rowsCol3[key]);
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
			// Sort by Destination
			function sortByDestination(d:Dictionary):Array {
				var a:Array = new Array();
				for (var dictionaryKey:Object in d)
					a.push({key:dictionaryKey,value:Card(Row(d[dictionaryKey]).getChildAt(0)).destination});
				a.sortOn('value',[Array.CASEINSENSITIVE]);
				var b:Array = new Array();
				for (var i=0; i<a.length; i++)
					b.push(a[i].key);
				return b;
			}   			
			
			var maxHeight = 0;
			var keepSpace = [];
			var NOTOPRows:Array = [];
			var _this = this;
			
			// set Y for each row
			function setY(rows,maxHeight):Number {
				var sortedArray:Array = maxHeight?sortDictionaryKeys(rows):sortByDestination(rows),
					spaceGiven:Boolean = false,
					werkSpacing: Boolean = false,
					extraSpaceGiven:Boolean = false,
					skippedRows:Number = 0,
					y = OPTIONS.headerHeight;
				for(var i:int=0; i<sortedArray.length; i++) {
					if(rows==_this.rowsCol2 && Card(Row(rows[sortedArray[i]]).getChildAt(0)).eersteWerk) keepSpace.push(y);
					while(rows==_this.rowsCol3 && keepSpace.indexOf(y)!=-1) {
						y += rows[sortedArray[i]].h;
					}
					// give a visual extra space for the charters
					if(isNaN(sortedArray[i]) && maxHeight && !spaceGiven) {
						spaceGiven = true;
						y += 40;//rows[sortedArray[i]].h;
					}
					if(isNaN(sortedArray[i]) && (sortedArray[i].indexOf('ZZZ')==0) && !extraSpaceGiven) {
						extraSpaceGiven = true;
						y += 40;//rows[sortedArray[i]].h;
					}
					rows[sortedArray[i]].setMultipleRows(maxHeight!=undefined?(maxHeight<y?5:3):1);
					
					// make a visual spacing for '1e and 2e werk' if the available trucks are full
					if(rows!=_this.rowsCol1 && i>=trucks.length-NOTOPRows.length && !werkSpacing) {
						werkSpacing=true;
						y += 40;
					}

					rows[sortedArray[i]].y = y;
					y += rows[sortedArray[i]].h;
				}
				return y;
			}
			
			// create a row for each truck
			for (var t=0; t<trucks.length; t++) {
				var myTruck = trucks[t];
				if(!this.rowsCol1[myTruck]) {
					var truckCard = new Card(null,myTruck,null,myXML);
					truckCard.showTruck();
					this.rowsCol1[myTruck] = new Row(truckCard,1);
					this.rowsCol1[myTruck].x = 0;
					this.addChild(this.rowsCol1[myTruck]);
				}
			}

			function getNOTOPRows(rows):void {
				var sortedArray:Array = sortDictionaryKeys(rows);
				for(var i:int=0; i<sortedArray.length; i++) {
					for(var j:int=0; j<Row(rows[sortedArray[i]]).numChildren; j++) {
						if(['RESERVATIE','DOK','ECONOMISCH WERKLOOS','ARBEIDSONGESCHIKT','ARBEIDSONGEVAL','BAANTRANSPORT','GARAGE','PARKING','VERLOF','ZIEKTE'].indexOf(Card(Row(rows[sortedArray[i]]).getChildAt(j)).activity)!=-1 &&
							!Card(Row(rows[sortedArray[i]]).getChildAt(j)).charter && NOTOPRows.indexOf(i)===-1) {
							NOTOPRows.push(i);
						}
					}
				}
			}

			getNOTOPRows(this.rowsCol1);

			maxHeight = Math.max(maxHeight,setY(this.rowsCol2,undefined));
			maxHeight = Math.max(maxHeight,setY(this.rowsCol3,undefined));
			
			setY(this.rowsCol1,maxHeight);
		}
	}
}