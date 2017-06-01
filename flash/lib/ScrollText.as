package lib {
	
	import flash.display.Sprite;
	import flash.text.*;
	import caurina.transitions.*;
	
	public class ScrollText extends Sprite{
		
		const TIME:int = 10;
		const DELAY:int = 0;
		
		var txtSprite:Sprite= new Sprite();
		var txtWidth:int = 0;
		
		public function ScrollText(txtField,str,bold:Boolean=false) {
			txtField.text = (str || '') + '  ';
			this.name = txtField.name;
			var fmt:TextFormat = txtField.getTextFormat();
			
			if(bold) {
				fmt.font += ' Bold';
				txtField.setTextFormat(fmt);
			}
			
			// if the textfield is to small, make it a scrolling text
			if(txtField.width<=txtField.textWidth) {
				this.x = txtField.x;
				this.y = txtField.y;

				// duplicate textFields
				var txt1:TextField = new TextField();
				var txt2:TextField = new TextField();
				
				txt1.antiAliasType = AntiAliasType.ADVANCED;
				txt2.antiAliasType = AntiAliasType.ADVANCED;
				
				fmt.align = 'left';
				
				txt1.embedFonts = true;
				txt2.embedFonts = true;

				txt1.setTextFormat(fmt);
				txt2.setTextFormat(fmt);
				
				txt1.text = txt2.text = txtField.text + '     ';
				
				txt1.setTextFormat(fmt);
				txt2.setTextFormat(fmt);

				this.txtWidth = txt2.x = txt1.width = txt2.width = txt1.textWidth;
				
				txtSprite.addChild(txt1);
				txtSprite.addChild(txt2);

				this.addChild(txtSprite);
				
				// create mask
				var myMask:Sprite = new Sprite();
				myMask.graphics.beginFill(0x99cc00);
				myMask.graphics.drawRect(0,0,txtField.width,txtField.height);
				this.addChild(myMask);
				this.mask = myMask;
				
				// replace the original txtField with this scrollable textField
				var card = txtField.parent;
				var index = card.getChildIndex(txtField);
				card.addChildAt(this,index);
				card.removeChild(txtField);
				this.animate();
			}
		}
		
		private function animate() {
			txtSprite.x = 0;
			Tweener.addTween(txtSprite, {x:-this.txtWidth, time:TIME, delay: DELAY, transition:'linear', onComplete:this.animate});
		}

	}
	
}
