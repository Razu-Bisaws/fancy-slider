const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = (images) => {
	// if images not empty show images else show notification
	if (images.length > 1) {
		imagesArea.style.display = 'block';
		gallery.innerHTML = '';
		//show gallery title
		galleryHeader.style.display = 'flex';
		images.forEach((image) => {
			let div = document.createElement('div');
			div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
			div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
			gallery.appendChild(div);
		});
		//  spinner will be toggle
		spinner();
	} else {
		spinner();
		toastNotification('Sorry Nothing Images Found, Please Try Again');
	}
};

const getImages = (query) => {
	fetch(
		`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
	)
		.then((response) => response.json())
		.then((data) => showImages(data.hits))
		.catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
	let element = event.target;
	element.classList.add('added');

	let item = sliders.indexOf(img);
	if (item === -1) {
		sliders.push(img);
	} else {
		// just filter the existing img using filter method
		sliders = sliders.filter((fil) => fil != img);
		element.classList.remove('added');
	}
};
var timer;
const createSlider = () => {
	// check slider image length
	if (sliders.length < 2) {
		toastNotification('Select at least 2 image.');
		return;
	}
	// crate slider previous area
	sliderContainer.innerHTML = '';
	const prevNext = document.createElement('div');
	prevNext.className =
		'prev-next d-flex w-100 justify-content-between align-items-center';
	prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

	sliderContainer.appendChild(prevNext);
	document.querySelector('.main').style.display = 'block';
	// hide image aria
	const duration = document.getElementById('duration').value || 1000;
	if (duration > 1) {
		imagesArea.style.display = 'none';
		sliders.forEach((slide) => {
			let item = document.createElement('div');
			item.className = 'slider-item';
			item.innerHTML = `<img class="w-100"
		src="${slide}"
		alt="">`;
			sliderContainer.appendChild(item);
		});
		changeSlide(0);
		timer = setInterval(function () {
			slideIndex++;
			changeSlide(slideIndex);
		}, duration);
	} else {
		
		toastNotification('Timer cannot be negative and problem fix');
	}
};

// change slider index
const changeItem = (index) => {
	changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
	const items = document.querySelectorAll('.slider-item');
	if (index < 0) {
		slideIndex = items.length - 1;
		index = slideIndex;
	}

	if (index >= items.length) {
		index = 0;
		slideIndex = 0;
	}

	items.forEach((item) => {
		item.style.display = 'none';
	});

	items[index].style.display = 'block';
};

searchBtn.addEventListener('click', function () {
	document.querySelector('.main').style.display = 'none';
	clearInterval(timer);
	const search = document.getElementById('search');
	getImages(search.value);
	search.value.length == 0
		? toastNotification(
				'You Search Word Is Invalid, But We showing Some Random Image'
		  )
		: '';
	// spinner running
	spinner();
	sliders.length = 0;
});

sliderBtn.addEventListener('click', function () {
	createSlider();
});

// search hit enter
document.querySelector('#search').addEventListener('keyup', (e) => {
	if (e.key == 'Enter') {
		searchBtn.click();
	}
});

// create slider hit enter
document.querySelector('#duration').addEventListener('keyup', (e) => {
	if (e.key == 'Enter') {
		sliderBtn.click();
	}
});

// extra added spinner
const spinner = () => {
	document.querySelector('.spinner').classList.toggle('d-none');
};

//notification Modal
const toastNotification = (noticeMessage) => {
	const model = document.querySelector('.model');
	const notification = document.createElement('div');
	notification.classList.add('notice');
	notification.innerText = noticeMessage;
	model.appendChild(notification);

	setTimeout(() => {
		notification.remove();
	}, 4000);
};
