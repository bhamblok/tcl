package lib {
	
	import flash.display.Sprite;
	import lib.Card;
	
	public class Row extends Sprite{
		
		var w:int = 0;
		var nrOfCardsPerRow:int = 0;
		var cardY:int = 0;
		
		public var h:int = 0;
					
		public function Row(card,nrOfCards) {
			nrOfCardsPerRow = nrOfCards;
			this.addCard(card, false);
		}
		
		public function addCard(card, givePriorityToProg) {
			var unique = true;
			if (givePriorityToProg) {
				for(var p=0; p<this.numChildren; p++) {
					if(Card(this.getChildAt(p)).id==card.id) {
						// SWAP TICKETS TO SHOW THE PROG INSTEAD OF THE PLAN
						if(Card(this.getChildAt(p)).statuscode == 'PLAN' && card.statuscode == 'PROG') {
							var oldCard = Card(this.getChildAt(p));
							card.x = oldCard.x;
							if (oldCard.truckShown) {
								card.truck = oldCard.truck;
								card.showTruck();
							}
							this.removeChild(Card(this.getChildAt(p)));
							this.addChildAt(card, p);
						}
						unique = false;
					}
				}
			} else {
				for(var i=0; i<this.numChildren; i++) {
					if(Card(this.getChildAt(i)).id==card.id) {
						unique = false;
					}
				}
			}
			if(unique) {
				card.x = w;
				w += card.w;
				this.addChild(card);
				this.sort(card);
				this.h = Math.ceil(this.numChildren/nrOfCardsPerRow)*card.h;
			}
		}
		
		public function sort(card) {
			// sort by time
			for(var i=0; i<this.numChildren; i++) {
				var oldCard = Card(this.getChildAt(i));
				if(oldCard.time!='' && card.time!='' && (oldCard.time>card.time && oldCard.x<card.x)) {
					var tmpX = oldCard.x;
					oldCard.x = card.x;
					card.x = tmpX;
					if(i==0) {
						oldCard.hideTruck();
						card.showTruck();
					} else {
						oldCard.showTruck();
						if(card.x>0) card.hideTruck();	
					}
				}
			}
		}
			
		// IF THIS ROW HAS MORE THAN [nrOfCardsPerRow] ITEMS, PUT IT ON MULTIPLE ROWS
		public function setMultipleRows(nrOfCardsPerRow) {
			this.h = Math.ceil(this.numChildren/nrOfCardsPerRow)*Card(this.getChildAt(0)).h;
			if(this.numChildren>nrOfCardsPerRow) {
				var i = 0;
				// SET CHILD INDEXES IN AN x-SEQUENTIAL ORDER
				for(i=1; i<this.numChildren; i++)
					for(var j=0; j<i; j++)
						if(this.getChildAt(j).x>this.getChildAt(i).x) this.swapChildren(this.getChildAt(j),this.getChildAt(i));
				var h = Card(this.getChildAt(nrOfCardsPerRow)).h;
				var x = 0;
				for(i=nrOfCardsPerRow; i<this.numChildren; i++) {
					this.getChildAt(i).y = Math.floor(i/nrOfCardsPerRow)*Card(this.getChildAt(i)).h;
					this.getChildAt(i).x = x;
					if(i%nrOfCardsPerRow===0) {
						x = 0;
						this.getChildAt(i).x = x;
						Card(this.getChildAt(i)).showTruck();
					} else {
						Card(this.getChildAt(i)).hideTruck();
					}
					x += Card(this.getChildAt(i)).w;
				}
			}
			for(i=1; i<this.numChildren; i++)
				if(Card(this.getChildAt(i)).truckShown && Card(this.getChildAt(i)).x>100)
					Card(this.getChildAt(i)).hideTruck();
		}
	}	
}
