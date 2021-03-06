/*	HTML Tools
	================================================ */

'use babel';

var exports=module.exports={
		/*	asciidoc Table
			================================================ */

			adocTable(data,delimiter,multiple) {
				var	{data,columns,headers,options}=text2table(data,delimiter,multiple);
				var table=[];
				let row='|====';
				if(options.header) table.push('[options="header"]');
				table.push(row);

				for(let i=0; i<data.length; i++) {
					let row=[];
					for(let j=0;j<headers.length;j++) {
						let item=data[i][j]||'';
						row[j]=item+' '.repeat(headers[j]-item.length);
					}
					table.push('| '+row.join(' | '));
				}
				table.push(row);
				return(table.join('\n'));
			},

		/*	ASCII Table
			================================================ */

			asciiTable(data,delimiter,multiple) {
				var	{data,columns,headers,options}=text2table(data,delimiter,multiple);
				var table=[];
				let row=[],Row=[],top,middle,Middle,bottom;
				for(let j=0;j<headers.length;j++)  {
					row[j]='-'.repeat(headers[j]+2);
					Row[j]='='.repeat(headers[j]+2);
				}
				middle='+'+row.join('+')+'+';
				Middle='+'+Row.join('+')+'+';

				table.push(middle);
				for(let i=0; i<data.length; i++) {
					let row=[];
					for(let j=0;j<headers.length;j++) {
						let item=data[i][j]||'';
						row[j]=item+' '.repeat(headers[j]-item.length);
					}
					data[i]=table.push('| '+row.join(' | ')+' |');
					if(options.interlines) table.push(middle);
				}
				if(!options.interlines) table.push(middle);

				if(options.header) {
					if(options.interlines) table[2]=Middle;
					else table.splice(2,0,Middle);
				}
				return table.join('\n');
			}

		/*	Box Character Table
			================================================
			╔═╦═╗	┏━┳━┓	┌─┬─┐
			║ ║ ║	┃ ┃ ┃	│ │ │
			╠═╬═╣	┣━╋━┫	╞═╪═╡
			║ ║ ║	┃ ┃ ┃	│ │ │
			╠═╬═╣	┣━╋━┫	├─┼─┤
			║ ║ ║	┃ ┃ ┃	│ │ │
			╚═╩═╝	┗━┻━┛	└─┴─┘
			================================================ */

			boxTable(data,delimiter,multiple) {
				var	{data,columns,headers,options}=text2table(data,delimiter,multiple);
				var table=[];
				let row=[],Row=[],top,middle,Middle,bottom;

				if(options.double) {
					for(let j=0;j<headers.length;j++)  {
						row[j]=Row[j]='═'.repeat(headers[j]+2);
					}
					top='╔'+Row.join('╦')+'╗';
					middle=Middle='╠'+Row.join('╬')+'╣';
					bottom='╚'+Row.join('╩')+'╝';
				}
				else {
					for(let j=0;j<headers.length;j++)  {
						row[j]='─'.repeat(headers[j]+2);
						Row[j]='═'.repeat(headers[j]+2);
					}
					top='┌'+row.join('┬')+'┐';
					middle='├'+row.join('┼')+'┤';
					Middle='╞'+Row.join('╪')+'╡';
					bottom='└'+row.join('┴')+'┘';
				}

				table.push(top);

				for(let i=0; i<data.length; i++) {
					let row=[];
					for(let j=0;j<headers.length;j++) {
						let item=data[i][j]||'';
						row[j]=item+' '.repeat(headers[j]-item.length);
					}
					if(options.double) table.push('║ '+row.join(' ║ ')+' ║');
					else table.push('│ '+row.join(' │ ')+' │');
					if(options.interlines) table.push(middle);
				}
				if(!options.interlines) table.push(middle);

				if(options.header) table[2]=Middle;
				table[table.length-1]=bottom;

				return table.join('\n');
			}

		/*	Github Flavoured Markdown Table
			================================================ */

			gfmTable(data,delimiter,multiple) {
				var	{data,columns,headers}=text2table(data,delimiter,multiple);
				var table=[];

				for(let i=0; i<data.length; i++) {
					let row=[];
					for(let j=0;j<headers.length;j++) {
						let item=data[i][j]||'';
						row[j]=item+' '.repeat(headers[j]-item.length);
					}
					table.push('| '+row.join(' | ')+' |');
				}
				let row=[];
				for(let j=0;j<headers.length;j++)  row[j]='-'.repeat(headers[j]+2);
				table.splice(1,0,'|'+row.join('|')+'|');
				return(table.join('\n'));
			}

		/*	HTML Table
			================================================ */

			htmlTable(data,delimiter,multiple,options) {
				if(!options) options={};
				var	{data,columns,headers,options}=text2table(data,delimiter,multiple);
				var start=0,tabs='\t';

				var table=['<table>'];

				if(options.sections) tabs='\t\t';

				if(options.header) {
					if(options.sections) table.push('\t<thead>');
					table.push('%s<tr><th>%s</th></tr>'.sprintf(tabs,data[0].join('</th><th>')));
					if(options.sections) table.push('\t</thead>');
					start=1;
				}

				if(options.sections) table.push('\t<tbody>');
				for(let i=start; i<data.length;i++) {
					table.push('%s<tr><td>%s</td></tr>'.sprintf(tabs,data[i].join('</td><td>')));
				}
				if(options.sections) table.push('\t</tbody>');
				table.push('</table>');
				return(table.join('\n'));
			}

		/*	Read Raw Data into an Array
			================================================ */

			text2table(data,delimiter,multiple) {
				if(multiple) delimiter=new RegExp(delimiter+'+');
				var options={};
				data=data.split(/\r\n|\n/);
				//	Options
					if(data[0].charAt(0)=='#') {
						data.shift().substring(1).trim().split(/\s*,\s*/).forEach(function(element,i) {
							options[element]=true;
						});
					}
				var columns=0;
				var headers=[];
				for(let i=0; i<data.length; i++) {
					data[i]=data[i].split(delimiter);
					columns=Math.max(columns,data[i].length);
					for(let j=0;j<data[i].length;j++) headers[j]=Math.max(headers[j]||0,data[i][j].length);
				}
				return {data,columns,headers,options};
			}

		/*	HTML Structure
			================================================ */

			makeHTMLStructure(text,parms,eol) {
				parms=parms||{};
				var structure=[], elements=[];

				var element;
				var options={};
				var placeholder = parms.placeholder || null;
				var subplaceholder = parms.subplaceholder || false;
				var html = parms.html || false;
				var empty = parms.empty || false;

				if(html) structure.push('<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<title>Title</title>\n\t<meta charset="UTF-8">\n</head>\n<body>');

				eol = eol || '\n';

				text=text.split(/\r\n|\n|\r/m);
				var i,l,n,item;
				var items=[];

				for(i=0;i<text.length;i++) if(text[i].match(/^\t*\S*/)[0]) items.push(text[i]);

				for(i=0;i<items.length;i++) {
					if(!items[i]) continue;
					l=level(items[i]);							//	Current Level
					n=i<items.length-1?level(items[i+1]):-1;	//	Next Level, if any

					item=items[i].replace(/^\t*/,'');

					var pattern=/^(.*?)(#(.*?))?(\.(.*?))?([: ](.*?))?$/;
					var result=item.match(pattern);

					element = result[1];
					options.id = result[3] || '';
					options.className = result[5] || '';
					options.content = result[7] || '';

					if(l<n) {	//	Has Content
						structure.push(openElement(element,l+1,options));
						if(subplaceholder) structure.push(openElement(item,l+2,{'placeholder':placeholder, 'content': options.content }));
						elements.push(element);
					}
					else { //	l>n => finished contents
						if(empty) {
							structure.push(
								openElement(element,l+1,options)+
								(placeholder?openElement(item,l+2,{'placeholder':placeholder, 'content': options.content }):'')+
								closeElement(element,l+1).trim());
						}
						else {
							structure.push(openElement(element,l+1,options));
							if(placeholder) structure.push(openElement(item,l+2,{'placeholder':placeholder, 'content': options.content }));
							structure.push(closeElement(element,l+1));
						}
						while(elements.length>n && n>-1) {
							structure.push(closeElement(elements.pop(),elements.length+1));
						}
					}
				}

				while(elements.length) {
					structure.push(closeElement(elements.pop(),elements.length));
				}

				if(html) structure.push('</body>\n</html>');
				return structure.join('\n');

				function level(text) {
					if(!text) return 0;
					var level, indent;
					indent=text.match(/^(\t*)/g)[0];
					level=indent.length;
					return level;
				}

				function openElement(element,level,options) {
					options=options||{};
					var placeholder=options.placeholder||'';
					var content=options.content||element;
					var id = options.id ? ' id="%s"'.sprintf(options.id) : '';
					var className = options.className?' class="%s"'.sprintf(options.className) : '';

					level=level||0;
					if(html) level++;
					var tabs=new Array(level).join('\t') || '';
					if(placeholder) {
						if(placeholder=='?')
							return '%s<h%s>%s</h%s>'.sprintf(tabs,level-1,content,level-1);
						else if(placeholder=='…')
							return '%s%s'.sprintf(tabs,content);
						return '%s<%s>%s</%s>'.sprintf(tabs,placeholder,content,placeholder);
					}
					return '%s<%s%s%s>'.sprintf(tabs,element,id,className);
				}

				function closeElement(element,level) {
					level=level||0;
					if(html) level++;
					var tabs=new Array(level).join('\t') || '';
					return '%s</%s>'.sprintf(tabs,element);
				}
			}

		/*	Forms
			================================================
			name			Label							<input type="text" name="name">
			@name			Label							<input type="email" name="name">
			name=value		Label							<input type="text" name="name" value="value">
			[name]			Label							<textarea name="name"></textarea>
			[name]=value	Label							<textarea name="name">value</textarea>
			()name=apple	Label							<input type="radio" name="name" value="value">
			[]name=apple	Label							<input type="checkbox" name="name" value="value">
			name:			Label	option;option=value	<select name="name">
																<option value="">
																<option value="value">
															</select>
			(send)			Label						<button name="send">Label</button>

			Options:	placeholder
						addForm
						action=
						method=
						id=
						className=
			================================================ */

			makeForm(text,options,eol) {
				eol=eol||'\n';
				var form=text.split(/\r\n|\r|\n/);
				var data=[],line;
				var items,label,item,value,required,element,type,name,placeholder;
				var addPlaceholder=!!options.placeholder;
				var addForm=!!options.addForm;
				var action=options.action||'';
				var method=options.method||'get';
				var id=options.id||'';
				var className=options.className||'';

				var br=options.br?'<br>':'';
				var labelFor=!!options.labelFor;

				for(var i=0;i<form.length;i++) {
					line=form[i].trim();
					if(line) data.push(line);
				}

				for(var i=0;i<data.length;i++) {
					items=data[i].split(/\t+/);

					if(items.length<2) label='';
					else label=items[1];
					if(items.length>2) options=items[2];

					item=items[0].split(/\s*=\s*/);
					if(item.length>1) value=item[1];
					else value='';
					item=item[0];

					if(item.slice(-1)=='*') {	//	doesn’t work for text areas
						required=true;
						item=item.slice(0,-1);
					}
					else required=false;

					switch(item.charAt(0)) {
						case '@':						//	email
							type='email';
							name=item.slice(1);
							break;
						case '[':						//	checkbox or textarea
							if(item.charAt(1)==']') {	//	checkbox
								type='checkbox';
								name=item.slice(2);
							}
							else {						//	textarea
								type='textarea';
								name=item.slice(1,-1);
							}
							break;
						case '(':						//	radio or button
							if(item.charAt(1)==')') {	//	radio
								type='radio';
								name=item.slice(2);
							}
							else {						//	button
								type='button';
								name=item.slice(1,-1);
							}
							break;
						default:						//	text or Select
							if(item.slice(-1)==':') {	//	select
								type='select';
								name=item.slice(0,-1);
								options=options.split(';');
								for(var o=0;o<options.length;o++) {
									item=options[o].split('=');
									options[o]={
										"text": item[0],
										"value": item[1]||''
									};
								}
							}
							else {
								type='text';
								name=item;
							}
					}

					data[i]={
						"name": name,
						"type": type,
						"label": label,
						"value": value,
						"required": required,
						"options": options
					};
				}

				for(var i=0;i<data.length;i++) {
					value = data[i].value ? ' value="%s"'.sprintf(data[i].value) : '';
					required = data[i].required ? ' required' : '';
					placeholder = addPlaceholder&&data[i].label ? ' placeholder="%s"'.sprintf(data[i].label) : '';
					var forID='%s-%s'.sprintf(id,data[i].name.replace(/\[\]$/,''));
					switch(data[i].type) {
						case 'text':
						case 'email':
							if(labelFor) {
								element='<input id="%s" name="%s" type="%s"%s%s%s>'.sprintf(forID,data[i].name,data[i].type,required,value,placeholder);
								element='<p><label for="%s">%s%s</label>%s</p>'.sprintf(forID,data[i].label,br,element);
							}
							else {
								element='<input name="%s" type="%s"%s%s%s>'.sprintf(data[i].name,data[i].type,required,value,placeholder);
								element='<p><label>%s%s%s</label></p>'.sprintf(data[i].label,br,element);
							}
							break;
						case 'radio':
						case 'checkbox':
							if(labelFor) {
								element='<input id="%s-%s" name="%s" type="%s"%s>'.sprintf(forID,data[i].value,data[i].name,data[i].type,required);
								element='<p>%s&nbsp;<label for="%s-%s">%s</label></p>'.sprintf(element,forID,data[i].value,data[i].label);
							}
							else {
								element='<input name="%s" type="%s"%s%s>'.sprintf(data[i].name,data[i].type,required,value);
								element='<p><label>%s&nbsp;%s</label></p>'.sprintf(element,data[i].label);
							}
							break;
						case 'textarea':
							if(labelFor) {
								element='<textarea id="%s" name="%s"%s%s>%s</textarea>'.sprintf(forID,data[i].name,required,placeholder,data[i].value);
								element='<p><label for="%s">%s%s</label>%s</p>'.sprintf(forID,data[i].label,br,element);
							}
							else {
								element='<textarea name="%s"%s%s>%s</textarea>'.sprintf(id,data[i].name,data[i].name,required,placeholder,data[i].value);
								element='<p><label>%s%s%s</label></p>'.sprintf(data[i].label,br,element);
							}
							break;
						case 'button':
							element='<p><button name="%s">%s</button></p>'.sprintf(data[i].name,data[i].label?data[i].label:data[i].name);
							break;
						case 'select':
							var options=[];
							for(var o=0;o<data[i].options.length;o++) options.push('\t\t<option value="%s">%s</option>'.sprintf(data[i].options[o].value,data[i].options[o].text));
							options=options.join('\n');
							if(labelFor) {
								element='<select id="%s" name="%s">%s</select>\n'.sprintf(forID,data[i].name,options);
								element='<p><label for="%s">%s%s</label>\t%s</p>'.sprintf(forID,data[i].label,br,element);
							}
							else {
								element='<select name="%s">%s</select>\n'.sprintf(options.id,data[i].name,data[i].name,options);
								element='<p><label>%s%s%s\t</label></p>'.sprintf(data[i].label,br,element);
							}
							break;
						default:
							element='';
					}
					data[i]=element;
				}

				if(!addForm) return data.join(eol);
				else {
					for(var i=0;i<data.length;i++) data[i]='\t'+data[i];
					if(id) id=' id="%s"'.sprintf(id);
					if(className) id=' class="%s"'.sprintf(className);
					return '<form%s%s method="%s" action="%s">%s%s%s</form>'.sprintf(id,className,method,action,eol,data.join(eol),eol);
				}
			}

		/*	Make Lists
			================================================
			================================================ */

			function makeList(text,parms,eol) {
				parms=parms || {};

				eol=eol || '\n';

				switch(parms.type) {
					case 'ul':
					case 'ol':
						if(parms.nested) return makeNestedList(text,parms,eol);
						else return makeSimpleList(text,parms,eol);
						break;
					case 'dl':
						if(parms.nested) return makeIndentedDescriptionList(text,parms,eol);
						else return makeDescriptionList(text,parms,eol);
				}

				//	Simple List

					function makeSimpleList(text,parms,eol) { // type,id,className,span,indents) {
						var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
						var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
						var type =	parms.type || 'ul'; if(type!='ol') type='ul';
						var span =	!!parms.span;
						var li = span ? '%s\t<li><span>%s</span></li>' : '%s\t<li>%s</li>';

						eol = eol || '\n';
						var pattern=/^(\s*)(.*?)\s*$/;

						var indent,data;

						var t=[];
						text=text.split(/\r\n|\n|\r/);
						for(var i=0;i<text.length;i++) {
							[,indent,data]=text[i].match(pattern);
							if(data) t.push(li.sprintf(indent,data));
						}
						return '%s<%s%s%s>\n%s\n%s</%s>\n'.sprintf(indent,type,id,className,t.join('\n'),indent,type).replace('\n',eol);
					}

				//	Nested List

					function makeNestedList(text,parms,eol) { // type,id,className,span) {
						var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
						var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
						var type =	parms.type || 'ul'; if(type!='ol') type='ul';

						eol = eol || '\n';

						function level(text) { return text ? text.match(/^(\t)*/g).toString().length : 0; }

						var test=text.split(/\r\n|\n|\r/m);
						var i,j,l,t,n,item;
						var items=[];
						var list=[];

						for(i=0;i<test.length;i++)
							if(test[i].match(/^\t*\S*/)) items.push(test[i]);	//	only keep non-empty lines

						//	New Version
						for(i=0;i<items.length;i++) {
							l=level(items[i]);
							t=new Array((l+1)*2).join('\t');

							n=level(items[i+1]);
							item=items[i].replace(/^\t*/,'');
							if(n>l) {							//	has contents
								list.push(t+'<li>'+item);
								list.push(t+'\t<'+type+'>');
							}
							else if(l==level(items[i+1])) {	//	same level
								list.push(t+'<li>'+item+'</li>');
							}

							else if(n<l)	{	//	finished contents
								list.push(t+'<li>'+item+'</li>');
								for(j=0;j<l-n;j++) {
									list.push(new Array((l-j)*2+1).join('\t')+'</'+type+'>');
									list.push(new Array((l-j)*2).join('\t')+'</li>');
								}
							}
						}
						return '<%s%s%s>\n%s\n</%s>\n'.sprintf(type,id,className,list.join('\n'),type).replace('\n',eol);
					}


				//	Simple Description List

					function makeDescriptionList(text,parms,eol) { // id,className,eol) {
						var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
						var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
						eol = eol || '\n';

						var dl=[];
						var i,l;
						text=text.split(/\r\n|\n|\r/);
						for(i=0,l=text.length;i<l;i++) {
							text[i]=text[i].replace(/\r\n|\n|\r/gm,'');
							if(text[i]) {
								if(i%2) dl.push('\t\t<dd>'+text[i]+'</dd>');
								else    dl.push('\t<dt>'+text[i]+'</dt>');
							}
						}
						return '<dl%s%s>\n%s\n</dl>\n'.sprintf(id,className,dl.join('\n')).replace('\n',eol);
					}

				//	Nested

					function makeIndentedDescriptionList(text,parms,eol) {
						var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
						var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
						eol = eol || '\n';

						var dl=[];
						var i,l;
						text=text.split(/\r\n|\n|\r/);
						for(i=0,l=text.length;i<l;i++) {
							text[i]=text[i].replace(/(\r\n|\n|\r)/gm,'');
							if(text[i]) {
								if(text[i].charAt(0)=='\t') dl.push('\t\t<dd>'+text[i].substr(1)+'</dd>');
								else    dl.push('\t<dt>'+text[i]+'</dt>');
							}
						}
						return '<dl%s%s>\n%s\n</dl>'.sprintf(id,className,dl.join('\n')).replace('\n',eol);
					}
				}
	};
export default exports;
