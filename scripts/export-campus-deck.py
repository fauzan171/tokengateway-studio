from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import pypdfium2 as pdfium
import json
root=Path(__file__).resolve().parent.parent
out=root/'output/presentasi-mahasiswa'
doc=pdfium.PdfDocument(str(out/'TokenGateway-Campus.pdf'))
print('PDF pages:',len(doc))
thumbs=[]
for i,page in enumerate(doc):
 im=page.render(scale=4/3).to_pil().convert('RGB')
 im.save(out/f'slide-{i+1:02d}.png')
 im.thumbnail((480,270))
 thumbs.append(im.copy())
w,h=2040,((len(thumbs)+3)//4)*320+90
sheet=Image.new('RGB',(w,h),'#10161d');draw=ImageDraw.Draw(sheet)
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',22)
draw.text((40,25),f'TokenGateway / Campus Session / {len(thumbs)} slides',font=font,fill='#f4f7fa')
for i,im in enumerate(thumbs):
 x=40+(i%4)*500;y=90+(i//4)*320
 sheet.paste(im,(x,y));draw.text((x,y+280),f'{i+1:02d}',font=font,fill='#16dde2')
sheet.save(out/'overview.png')
print('Exported',len(thumbs),'slide PNGs + overview')
