(()=>{
	const colors = {
		red: '#e11',
		green: '#1e1',
		blue: '#11e',
		yellow: '#ee1',
		cyan: '#1ee',
		magenta: '#e1e',
		white: '#eee',
		black: '#111'};

	const algorithms = {
		partition:
		function*(array, lower, upper){
			const pivotValue = array.getValueAt(Math.floor(
			(upper + lower) / 2));
			let i = lower;
			let j = upper;
			for(;;){
				while(array.getValueAt(i) < pivotValue){
					++i;
					array.setColorAt(i, colors.green);
					array.setColorAt(i - 1, colors.black);
					yield;}
				while(array.getValueAt(j) > pivotValue){
					--j;
					array.setColorAt(j, colors.magenta);
					array.setColorAt(j + 1, colors.black);
					yield;}
				if(i >= j){
					array.setColorAt(i, colors.black);
					array.setColorAt(j, colors.black);
					return j;}
				array.swapValuesAt(i, j);
				array.setColorAt(i, colors.black);
				array.setColorAt(j, colors.black);
				++i;
				--j;}},
		recursiveQuickSort:
		function*(array, lower, upper){
			if(lower < upper){
				const pivot = yield* this.partition(array, lower, upper);
				yield* this.recursiveQuickSort(array, lower, pivot);
				yield* this.recursiveQuickSort(array, pivot + 1, upper);}},
		quickSort:
		function*(array){
			yield* this.recursiveQuickSort(array, 0, array.length - 1);},
		merge:
		function*(workArray, begin, middle, end, array){
			let i = begin;
			let j = middle;
			for(let k = begin; k < end; ++k){
				array.setColorAt(begin, colors.green);
				array.setColorAt(end - 1, colors.magenta);
				array.setColorAt(i, colors.red);
				if(j < end){
					array.setColorAt(j, colors.cyan);}
				yield;
				if(i < middle && (j >= end || workArray.getValueAt(i) <= 
				workArray.getValueAt(j))){
					array.setValueAt(k, workArray.getValueAt(i));
					++i;
					array.setColorAt(i - 1, colors.black);}
				else{
					array.setValueAt(k, workArray.getValueAt(j));
					++j;
					array.setColorAt(j - 1, colors.black);}}
			array.setColorAt(begin, colors.black);
			array.setColorAt(end - 1, colors.black);
			array.setColorAt(i, colors.black);
			if(j < end){
				array.setColorAt(j, colors.black);}},
		recursiveMergeSort:
		function*(workArray, begin, end, array){
			if(end - begin <= 1){
				return;}
			const middle = Math.floor((end + begin) / 2);
			yield* this.recursiveMergeSort(array, begin, middle, workArray);
			yield* this.recursiveMergeSort(array, middle, end, workArray);
			yield* this.merge(workArray, begin, middle, end, array);},
		mergeSort:
		function*(array){
			const workArray = {
				data: [],
				length: array.length,
				getValueAt:
				function(index){
					return this.data[index];},
				setValueAt:
				function(index, value){
					this.data[index] = value;},
				setColorAt:
				function(index, color){}};
			for(let i = 0; i < array.length; ++i){
				workArray.data.push(array.getValueAt(i));}
			yield* this.recursiveMergeSort(workArray, 0, array.length, array);},
		siftDown:
		function*(array, lower, upper){
			let node = lower;
			for(;;){
				const left = 2 * node + 1;
				const right = left + 1;
				let largestNode = node;
				if(left <= upper){
					if(array.getValueAt(left) > array.getValueAt(
					largestNode)){
						largestNode = left;}}
				if(right <= upper){
					if(array.getValueAt(right) > array.getValueAt(
					largestNode)){
						largestNode = right;}}
				if(largestNode === node){
					break;}
				array.setColorAt(node, colors.red);
				array.setColorAt(largestNode, colors.cyan);
				yield;
				array.swapValuesAt(node, largestNode);
				array.setColorAt(node, colors.black);
				array.setColorAt(largestNode, colors.black);
				node = largestNode;}},
		heapify:
		function*(array, lower, upper){
			let start = Math.floor((upper - 1) / 2);
			while(start >= 0){
				array.setColorAt(start, colors.green);
				array.setColorAt(upper, colors.magenta);
				yield;
				yield* this.siftDown(array, start, upper);
				--start;
				array.setColorAt(start + 1, colors.black);}},
		rangedHeapSort:
		function*(array, lower, upper){
			yield* this.heapify(array, lower, upper);
			while(upper > 0){
				array.setColorAt(lower, colors.green);
				array.setColorAt(upper, colors.magenta);
				yield;
				array.swapValuesAt(lower, upper);
				--upper;
				array.setColorAt(upper + 1, colors.black);
				yield* this.siftDown(array, lower, upper);}},
		heapSort:
		function*(array){
			yield* this.rangedHeapSort(array, 0, array.length - 1);},
		rangedInsertionSort:
		function*(array, lower, upper){
			lower += 1;
			upper += 1;
			let i = lower;
			while(i < upper){
				let j = i;
				for(;;){
					if(j <= 0){
						break;}
					array.setColorAt(i, colors.green);
					array.setColorAt(j, colors.magenta);
					yield;
					if(parseInt(array.getValueAt(j - 1)) <= 
					parseInt(array.getValueAt(j))){
						array.setColorAt(j, colors.black);
						break;}
					array.swapValuesAt(j, j - 1);
					--j;
					array.setColorAt(j + 1, colors.black);}
				++i;
				array.setColorAt(i - 1, colors.black);}},
		insertionSort:
		function*(array){
			yield* this.rangedInsertionSort(array, 0, array.length - 1);}};
	const array = {
		data: null,
		length: null,
		minValue: null,
		maxValue: null,
		getValueAt: 
		function(index){
			return parseInt(this.data.item(index).dataset['value']);},
		getColorAt:
		function(index){
			return this.data.item(index).dataset['color'];},
		setValueAt:
		function(index, value){
			const percentValue = (value - this.minValue) / (this.maxValue - 
			this.minValue) * 100;
			const item = this.data.item(index);
			const dataset = item.dataset;
			dataset['value'] = value;
			dataset['percentValue'] = percentValue;
			item.style.background = 'linear-gradient(to top,' + dataset['color'] + 
			' ' + percentValue + '%,' + colors.white + ' ' + percentValue + 
			'% 100%';},
		setColorAt:
		function(index, color){
			const item = this.data.item(index);
			const dataset = item.dataset;
			const percentValue = dataset['percentValue'];
			dataset['color'] = color;
			item.style.background = 'linear-gradient(to top,' +
			color + ' ' + percentValue + '%,' + colors.white + ' ' + percentValue + 
			'% 100%)';},
		setValueAndColorAt:
		function(index, value, color){
			const percentValue = (value - this.minValue) / (this.maxValue -
			this.minValue) * 100;
			const item = this.data.item(index);
			const dataset = item.dataset;
			dataset['value'] = value;
			dataset['percentValue'] = percentValue;
			dataset['color'] = color;
			item.style.background = 'linear-gradient(to top,' + color + ' ' + 
			percentValue + '%,' + colors.white + ' ' + percentValue + '% 100%)';},
		swapValuesAt:
		function(firstIndex, secondIndex){
			const firstItem = this.data.item(firstIndex);
			const secondItem = this.data.item(secondIndex);
			const firstDataset = firstItem.dataset;
			const secondDataset = secondItem.dataset;
			const firstValue = firstDataset['value'];
			const secondValue = secondDataset['value'];
			firstDataset['value'] = secondValue;
			secondDataset['value'] = firstValue;
			const firstPercentValue = firstDataset['percentValue'];
			const secondPercentValue = secondDataset['percentValue'];
			firstDataset['percentValue'] = secondPercentValue;
			secondDataset['percentValue'] = firstPercentValue;
			const firstColor = firstDataset['color'];
			const secondColor = secondDataset['color'];
			firstItem.style.background = 'linear-gradient(to top,' + firstColor + 
			' ' + secondPercentValue + '%,' + colors.white + ' ' + 
			secondPercentValue + '% 100%)';
			secondItem.style.background = 'linear-gradient(to top', + secondColor +
			' ' + firstPercentValue + '%,' + colors.white + ' ' + firstPercentValue +
			'% 100%)';}};

	const animation = {
		coroutine: null,
		intervalID: null,
		delay: null,
		step:
		function(onDone = null){
			if(this.coroutine.next().done){
				if(onDone){
					onDone();}}},
		pause:
		function(){
			clearInterval(this.intervalID);},
		play:
		function(onDone = null){
			this.intervalID = setInterval(this.step.bind(this, onDone), 
			this.delay);},
		stop:
		function(){
			clearInterval(this.intervalID);
			this.coroutine = null;}};
		
	const main = ()=>{
		const elements = {};
		let cellHeight, cellWidth;
		['begin', 'setup', 'controls', 'stop', 'length', 'min', 'max', 'view', 
		'algorithm', 'play-pause', 'stop', 'step', 'speed', 'zoom'].forEach(
		(e)=>{
			elements[e] = document.getElementById(e);});
		const onSorted = ()=>{
			elements['stop'].click();};
		['length', 'min', 'max'].forEach(
		(i)=>{
			elements[i].addEventListener('click',
			(event)=>{
				event.target.select();});});
		elements['begin'].addEventListener('click',
		(event)=>{
			const length = parseInt(elements['length'].value);
			if(isNaN(length)){
				return;}
			const minValue = parseInt(elements['min'].value);
			if(isNaN(minValue)){
				return;}
			const maxValue = parseInt(elements['max'].value);
			if(isNaN(maxValue)){
				return;}
			elements['setup'].style.visibility = 'hidden';
			elements['setup'].style.height = '0';
			elements['controls'].style.display = 'block';
			while(elements['view'].lastChild){
				elements['view'].removeChild(elements['view'].lastChild);};
			array.data = elements['view'].cells;
			array.length = length;
			array.minValue = minValue;
			array.maxValue = maxValue;
			cellHeight = 51 * (elements['zoom'].value / 100.0);
			cellWidth = (elements['zoom'].value / 100.0);
			for(let i = 0; i < array.length; ++i){
				const e = document.createElement('td');
				e.style.height = cellHeight + 'em';
				e.style.width = cellWidth + 'em';
				elements['view'].appendChild(e);
				array.setValueAndColorAt(i, Math.trunc(Math.random() * (maxValue - 
				minValue) + minValue), colors.black);};});
		elements['speed'].addEventListener('input',
		(event)=>{
			animation.delay = 1.0 / parseFloat(event.target.value) * 1000.0;});
		elements['zoom'].addEventListener('input',
		(event)=>{
			cellHeight = 51 * (event.target.value / 100.0);
			cellWidth = 1 * (event.target.value / 100.0);
			for(let i = 0; i < elements['view'].childNodes.length; ++i){
				style = elements['view'].childNodes[i].style;
				style.height = cellHeight + 'em';
				style.width = cellWidth + 'em';}});
		elements['play-pause'].addEventListener('click',
		(event)=>{
			if(event.target.value === 'Play'){
				if(!animation.coroutine){
					animation.coroutine = algorithms[elements['algorithm'].value](
					array);}
				animation.delay = 1.0 / parseFloat(elements['speed'].value) * 1000.0;
				animation.play(onSorted);
				event.target.value = 'Pause';
				elements['speed'].disabled = true;
				elements['zoom'].disabled = true;
				elements['step'].disabled = true;}
			else{
				animation.pause();
				event.target.value = 'Play';
				elements['speed'].disabled = false;
				elements['zoom'].disabled = false;
				elements['step'].disabled = false;}});
		elements['stop'].addEventListener('click',
		(event)=>{
			animation.stop();
			for(let i = 0; i < array.length; ++i){
				array.setColorAt(i, colors.black);}
			elements['play-pause'].value = 'Play';
			elements['speed'].disabled = false;
			elements['zoom'].disabled = false;
			elements['step'].disabled = false;
			elements['setup'].style.height = 'initial';
			elements['setup'].style.visibility = 'visible';
			elements['controls'].style.display = 'none';});
		elements['step'].addEventListener('click',
		(event)=>{
			if(!animation.coroutine){
				animation.coroutine = algorithms[elements['algorithm'].value](array);}
			animation.step(onSorted);});
		elements['begin'].click();};
	if(document.readyState === 'loading'){
		document.addEventListener('DOMContentLoaded', (event)=>{
			main();});}
	else{
		main();}})();
		
		
