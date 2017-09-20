package lib {

	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.geom.ColorTransform;
	import flash.utils.Dictionary;
	import lib.ScrollText;
	import flash.events.DataEvent;

	public class Card extends MovieClip {

		var card: MovieClip,
			myMask: Sprite = new Sprite(),
			loadingTime: Number = 0,
			loading: String = '',
			prior: Array = ['0', 'Eerste werk', 'Laatste werk', '!'];

		public var truck: String = '';
		public var hideCustoms: Boolean = false;
		public var display: Boolean = true;
		public var charter: Boolean = false;
		public var truckShown: Boolean= false;
		public var activity: String = '';
		public var direction: String = '';
		public var time: Number = 0;
		public var timereq: Number = 0;
		public var id: String = '';
		public var groupBy: String = '';
		public var sortBy: String = '';
		//public var pickup_name: String = '';
		public var destination: String = '';
		public var eersteWerk: Boolean = false;
		public var oldNOTOP: Boolean = false;
		public var statuscode: String = '';
		public var Intermodal_FINAC_Analytic_Code: String = '';

		public var w: int = 0;
		public var h: int = 0;
		
		private var dok: Boolean = false;

		public function Card(item, itemType, dok, myXML) {
			if(item==null) {
				card = new Card_truck_mc();
				this.truck = itemType;
				card.truck_fleet_number.text = this.truck;
				this.w = card.card_bg.width;
				this.h = card.card_bg.height;
				this.addChild(card);
			} else {

				this.statuscode = item.STATUSCODE;
				
				this.addEventListener('click', function(e) {
					trace(item);
				});
				
				// check if this card needs to be hidden because it is a duplicate for another card which needs to go to customs first
				if(item.STATUS2.toUpperCase()==='OP TE HALEN' && (String(item.Customs_formalities_name) || String(item.Scan_formalities_name))) {
					if (String(item.Action_From) == String(item.Customs_formalities_name) || String(item.Action_From) == String(item.Scan_formalities_name)) {
						var counter = 0;
						for each(var itemCheck:XML in myXML.ttplanning) {
							if(itemCheck.STATUS2.toUpperCase()==='OP TE HALEN' && String(itemCheck.Original_Cargo_Number) == String(item.Original_Cargo_Number)) {
								counter++;
							}
						}
						if (counter > 1) {
							this.hideCustoms = true;
						}
					}
				}
				
				// get public vars
				this.id = item.Intermodal_Cargo_obj;
				this.Intermodal_FINAC_Analytic_Code = item.Intermodal_FINAC_Analytic_Code;
				
				//if (item.Intermodal_Cargo_Number == 'MSWU 903636-1') {
					//trace(item);
				//}
				
				this.truck = item.Truck_Fleet_Number.replace('[','').replace(']','');
				this.activity = item.ACTIVITEIT.toUpperCase();
				if(item.STATUS2.toUpperCase()==='DOK') this.activity = 'DOK';
				this.direction = (item.Direction == 'U'?'OUTGOING':'INCOMING');
				this.timereq = this.time = Number(item.TIMEREQ.split(',')[0]);
				this.timereq = this.timereq/100;
				if(this.timereq>24) this.timereq = this.timereq/100;
					
				this.eersteWerk = item.PRIOR==1?true:false;
				
				this.charter = isNaN(item.Truck_Fleet_Number.split(' ')[0]);
								
				if(['BAANTRANSPORT','DOKTRANSPORT'].indexOf(this.activity)==-1) {
					this.id = String(Math.random());
				}
				
				var actionToQparCHUB = (String(item.Action_To_QPAR)=='CHUB' || String(item.Action_To_QPAR)=='CHUB2');
				var actionFromQparCHUB = (String(item.Action_From_QPAR)=='CHUB' || String(item.Action_From_QPAR)=='CHUB2');
				var actionToEqualsUnLoading = (String(item.Action_To)==String(item.Loading_facility_name) || String(item.Action_To)==String(item.Unloading_facility_name));
				
				
				// if(actionToQparCHUB || actionFromQparCHUB) {
					//this.id = item.Intermodal_Cargo_obj + 'CHUB';
				//}
				
				// get groupBy and sortBy properties
				switch(itemType) {
					case 'OP TE HALEN':
						this.id = String(Math.random());
						
						if(actionToQparCHUB || actionFromQparCHUB) {						
							this.groupBy = item.Action_From;
						} else {
							this.groupBy = item.Pickup_name;
						}
						if(this.direction == 'OUTGOING') {
							if(item.closing_date_ams) this.sortBy = item.closing_date_ams;
							else this.sortBy = item.closing_date;
						} else {
							this.sortBy = item.Free_until_date;
						}
						break;
					case 'TE LADEN':
						this.id = String(Math.random());
						this.groupBy = item.Loading_facility_name;
						this.sortBy = item.closing_date;
						break;
					case 'TE LOSSEN':
						this.id = String(Math.random());
						this.groupBy = item.Unloading_facility_name;
						this.sortBy = item.Detention_date;
						break;
					case 'GELADEN':
						this.id = String(Math.random());
						this.groupBy = item.Turnin_name;
						this.sortBy = item.closing_date;
						break;
					case 'GELOST':
						this.id = String(Math.random());
						if((actionToQparCHUB || actionFromQparCHUB) && !(actionFromQparCHUB && actionToEqualsUnLoading)) {
							this.groupBy = item.Action_To;
						} else {
							this.groupBy = item.Turnin_name;
						}
						this.sortBy = item.Detention_date;
						break;
					case 'CHASSIS':					
					case 'PARKING':
					case 'GARAGE':
						this.id = String(Math.random());
						this.groupBy = this.activity;
						this.sortBy = this.truck;
						break;
				}
				
				// SHOW TRUCK 'HUB' FOR CARDS IN THE 2nd FLOW OF A HUB-DELIVERY
				if ((item.Action_From_QPAR == 'CHUB' || item.Action_From_QPAR == 'CHUB2') && item.Action_To_QPAR == 'TURNIN') {
					if(this.truck == '') {
						this.truck = 'HUB\t\t\t\t\t' + (item.Action_From_Alias || item.Action_From);
						this.groupBy = item.Action_To;
						this.sortBy = item.Action_To;
					}
				}
				
				// oldNOTOP
				if (['BAANTRANSPORT','DOKTRANSPORT','RESERVATIE'].indexOf(this.activity)==-1) {
					var dateString:String = (item.Date_active!=undefined?item.Date_active:(item.ttplanningdet.Date_active!=undefined?item.ttplanningdet.Date_active:''));				
					if( dateString != '' ) {
						var itemDate:Date;
						var datePattern : RegExp = /(\d{4})-(\d+)-(\d+)( (\d+):(\d+):(\d+))?/;
						var result : Object = datePattern.exec( dateString );
						if( result[ 4 ] != null ) itemDate = new Date( result[1], result[2] - 1, result[3], result[ 5 ], result[ 6 ], result[ 7 ] );
						itemDate = new Date( result[1], result[2] - 1, result[3]);
						var yesterday = new Date(new Date().fullYear, new Date().month, (new Date().date)-1);
						// if this not-operational card is older than "yesterday"
						if(itemDate.time<yesterday.time) {
							this.oldNOTOP = true;
						}
					}
				}

				// get the right movieClip from the library
				if (['BAANTRANSPORT','DOKTRANSPORT','RESERVATIE'].indexOf(this.activity)==-1) card = new Card_verlof_ziekte_mc();
				else if (this.activity=='RESERVATIE') card = new Card_reservatie_mc();			
				//else if (item.STATUSCODE == "PROG" && item.Trailer_Fleet_Number != '') {
				else if ((item.StatusEurotracs == "RECEIVED" || item.STATUSCODE == "PROG") && item.Trailer_Fleet_Number != '') {
					card = new Card_w_trailer_mc();
				} else {
					card = new Card_mc();
				}
				

				this.addChild(card);

				if(dok) {
					this.dok = true;
					card.bg.x = -6;
					card.bg.width = 214;
					card.card_bg.width = 216;
					card.x = 6;
				}
				this.w = card.card_bg.width;
				this.h = card.card_bg.height;
					
				card.icon_prior.visible = false;
				card.icon_alert.visible = false;


				// set card Background color
				var myColor = new ColorTransform(),
					container_size = Number(item.Container_size_code.split(' ')[0]);
				if(this.activity == 'RESERVATIE') myColor.color = 0x99cc00;
				else if (['BAANTRANSPORT','DOKTRANSPORT','RESERVATIE'].indexOf(this.activity)==-1) myColor.color = 0xff0000;
				else if (container_size <= 20) myColor.color = 0xffffbb;
				else if (container_size <= 40) myColor.color = 0xbbddff;
				else myColor.color = 0xccff66;//0xeeeeee;
				
				card.bg.transform.colorTransform = myColor;
				
 				function formatTime(time) {
					return time.toFixed(2).replace('.','u').replace('u00', 'u');
				}

				// VERLOF/ZIEKTE
				if (['BAANTRANSPORT','DOKTRANSPORT','RESERVATIE','GARAGE','PARKING'].indexOf(this.activity)==-1) {
					this.id = item.CHAUFFEUR;
					card.truck_fleet_number.text = this.truck;
					card.chauffeur.text = '';//item.CHAUFFEUR;
					card.chauffeur_verlof.text = item.CHAUFFEUR;
					card.activity.text = this.activity;
					if(this.truck=='') this.truck = (this.activity=='VERLOF'?'ZZZZ':'ZZZY');
				// GARAGE/PARKING
				} else if (['GARAGE','PARKING'].indexOf(this.activity)!=-1) {
					this.id = item.Trailer_Fleet_Number;
					card.truck_fleet_number.text = this.truck;
					card.chauffeur.text = item.CHAUFFEUR;
					card.chauffeur_verlof.text = item.Trailer_Fleet_Number;
					card.activity.text = this.activity;
					this.time = this.time/100;
					if(this.time>24) this.time = this.time/100;
				// RESERVATIE
				} else if (['RESERVATIE'].indexOf(this.activity)!=-1) {
					card.direction.text = (item.Direction != 'Inkomend'?'OUTGOING':'INCOMING');
					card.truck_fleet_number.text = this.truck;
					card.chauffeur.text = item.CHAUFFEUR;
					card.activity.text = this.activity;
					if(card.size && card.size.text && container_size) card.size.text = container_size+"'";
					this.time = this.time/100;
					if(this.time>24) this.time = this.time/100;
					this.destination = item.ADRES;
					new ScrollText(card.loading, (this.time > 0 ? formatTime(this.time) + ' ' : '') + item.ADRES); //loading
				// ANY OTHER CARDS
				} else {
					//new ScrollText(card.truck_fleet_number, this.truck, true); //truck_fleet_number
					card.truck_fleet_number.text = this.truck;
					//new ScrollText(card.chauffeur, item.CHAUFFEUR, true); //chauffeur
					card.chauffeur.text = item.CHAUFFEUR;

				//if (item.Original_Cargo_Number == 'MSWU 008705-4') {
				//	trace(item);
				//}
					
				//if (this.Intermodal_FINAC_Analytic_Code == '177004194' && this.truck == '135') {
				//	trace(item);
				//}


					
					// containerHubs can change pickup-name
					if(actionToQparCHUB || actionFromQparCHUB) {
				//if (this.truck == '135') {
				//	trace(this.id, this.truck, actionToQparCHUB, actionFromQparCHUB, item.Pickup_name,'-', item.Action_From,'-', item.Action_From_Alias);
				//}
						var pickupName = item.Action_From;
						if (String(item.Action_From_Alias)) pickupName = item.Action_From_Alias;
						new ScrollText(card.pickup_name, pickupName); //pickup_name
					} else {
				//if (this.truck == '135') {
				//	trace('-',this.id, this.truck, actionToQparCHUB, actionFromQparCHUB, item.Pickup_name,'-', item.Action_From,'-', item.Action_From_Alias);
				//}
						new ScrollText(card.pickup_name, item.Pickup_name); //pickup_name
					}
					
					// containerHubs can change turnin-name
					if((actionToQparCHUB || actionFromQparCHUB) && !(actionFromQparCHUB && actionToEqualsUnLoading)) {
						var turninName = item.Action_To;
						if (String(item.Action_To_Alias)) turninName = item.Action_To_Alias;
						new ScrollText(card.turnin_name, turninName); //turnin_name
					} else {
						new ScrollText(card.turnin_name, item.Turnin_name); //turnin_name
					}

					new ScrollText(card.container_type, item.Container_ISO_Code);//item.Container_type); //container_type
					new ScrollText(card.in_out_coming, item.free_until_date); //in_out_coming
					//new ScrollText(card.cargo_weight, item.cargo_weight); //cargo_weight
					new ScrollText(card.in_out_coming_2, item.detention_date); //in_out_coming_2
									
					var OCN:String = item.Intermodal_Cargo_Number;//item.Original_Cargo_Number;
					if(OCN.indexOf('TO BE NOMINATED')!==-1) OCN = 'TBN';
					new ScrollText(card.original_cargo_number, OCN);
					//card.original_cargo_number.text = item.Original_Cargo_Number;

					if(item.PRIOR==3) card.icon_prior.visible = true;
					if(item.Alert!='') card.icon_alert.visible = true;

					if (this.activity == 'BAANTRANSPORT') {
						//new ScrollText(card.prior, prior[item.PRIOR]); //prior
						//if(item.PRIOR==3) card.prior.text = '!';
						//else card.prior.text = '';
						
						//new ScrollText(card.original_cargo_number, item.Original_Cargo_Number); //original_cargo_number
						new ScrollText(card.avail_after_customs_ref, item.Avail_after_customs_ref); //avail_after_customs_ref
						
						if (this.direction == 'OUTGOING') {
							//loadingTime = (itemType == 'TIMEPLANVAN'?Number(item.ttplanningdet.TIMEPLANVAN):Number(item.Loading_Time)) / 10000;
							this.destination = item.Loading_facility_location;
							this.time = (itemType == 'TIMEREQ' || item.Loading_Time==''?Number(this.time):Number(item.Loading_Time)) / 10000;
							new ScrollText(card.loading, (this.time > 0 ? formatTime(this.time) + ' ' : '') + item.Loading_facility_location, true); //loading
							
						} else {
							//loadingTime = (itemType == 'TIMEPLANVAN'?Number(item.ttplanningdet.TIMEPLANVAN):Number(item.Unloading_Time)) / 10000;
							this.destination = item.Unloading_facility_location;
							this.time = (itemType == 'TIMEREQ' || item.Unloading_Time==''?Number(this.time):Number(item.Unloading_Time)) / 10000;
							new ScrollText(card.loading, (this.time > 0 ? formatTime(this.time) + ' ' : '') + item.Unloading_facility_location, true); //loading
						}
					} else {
						//new ScrollText(card.prior, ''); //prior
						
						if (this.activity == 'DOKTRANSPORT') {
							//new ScrollText(card.original_cargo_number, item.Original_Cargo_Number, true); //original_cargo_number
							new ScrollText(card.avail_after_customs_ref, item.Avail_after_customs_ref, true); //avail_after_customs_ref
							
							if (this.direction == 'OUTGOING') {
								this.destination = item.Loading_facility_name;
								this.time = (itemType == 'TIMEREQ'?Number(this.time):Number(item.Loading_Time)) / 10000;
								new ScrollText(card.loading, (this.time > 0 ? formatTime(this.time) + ' ' : '') + item.Loading_facility_name, true); //loading
								formatTime(this.time);
								//new ScrollText(card.loading, item.Loading_facility_name); //loading
							} else {
								this.destination = item.Unloading_facility_name;
								this.time = (itemType == 'TIMEREQ'?Number(this.time):Number(item.Unloading_Time)) / 10000;
								new ScrollText(card.loading, (this.time > 0 ? formatTime(this.time) + ' ' : '') + item.Unloading_facility_name, true); //loading
								
								//new ScrollText(card.loading, item.Unloading_facility_name); //loading
							}
						}
					}
					
					function convertDate(prefix, str) {
						if (str != '') {
							var date: Array = str.split('-');
							return prefix + ' ' + String(date[2]) + '/' + String(date[1]);
						} else return '';
					}

					if (this.direction == 'INCOMING') {
						if(itemType=='TE LOSSEN' || itemType=='GELOST') new ScrollText(card.in_out_coming, convertDate('Det.', item.Detention_date)); //in_out_coming
						else new ScrollText(card.in_out_coming, convertDate('Vrij', item.Free_until_date)); //in_out_coming
						new ScrollText(card.in_out_coming_2, convertDate('AMS', item.closing_date_ams)); //in_out_coming_2
					} else if (this.direction == 'OUTGOING') {
						new ScrollText(card.in_out_coming, convertDate('Det.', item.Detention_date)); //in_out_coming
						new ScrollText(card.in_out_coming_2, convertDate('CLD', item.closing_date)); //in_out_coming_2
					}

					//if (item.STATUSCODE == "PROG" && item.Trailer_Fleet_Number != '') {
					if ((item.StatusEurotracs == "RECEIVED" || item.STATUSCODE == "PROG") && item.Trailer_Fleet_Number != '') {
						new ScrollText(card.trailer_fleet_number, item.Trailer_Fleet_Number);
					}
				}

				// least wedergebruik wachtzone
				if(item.Container_wedergebruik==true || item.Container_wachtzone==true) {
					card.addChildAt(new bg_dashed(),card.getChildIndex(card.getChildByName('bg'))+1);
				}
				
				card.truck_bg.visible = false;
				card.chauffeur.visible = false;
				card.truck_fleet_number.visible = false;
			}
		}

		public function showTruck() {
			if(this.truck && !this.truckShown && !this.dok) {
				this.truckShown = true;
				card.x -= card.truck_bg.x;
				this.w -= card.truck_bg.x;
				card.truck_bg.visible = true;
				if(card.chauffeur) card.chauffeur.visible = true;
				card.truck_fleet_number.visible = true;
			}
		}
		
		public function hideTruck() {
			if(this.truck && this.truckShown) {
				this.truckShown = false;
				card.x += card.truck_bg.x;
				this.w += card.truck_bg.x;
				card.truck_bg.visible = false;
				if(card.chauffeur) card.chauffeur.visible = false;
				card.truck_fleet_number.visible = false;
			}
		}		
	}
}