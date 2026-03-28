const pages404 = {
  "pages": [
    {
      "title": "Oops! Page Not Found",
      "description": "Oh-Uh looks like something wrong happened :<<br>maybe the page got deleted or dont exist anymore...<br>but don't worry",
      "type": "image",
      "content": "/images/aha.png",
      "contentAlt": "Oops!"
    },
    {
      "title": "OOPS! WeebOwO got hit by big ass 404",
      "description": "help her to get up by clicking<br>\"Go back to Home\" button below :3",
      "type": "image",
      "content": "/images/404 1.png",
      "contentAlt": "WeebOwO got hit"
    },
    {
      "title": "awwh nuuu what happened :<",
      "description": "this is fucked up...<br>chu know what else is fucked up?<br>what the dog doin? :0",
      "type": "youtube-with-reactions",
      "content": "https://www.youtube.com/embed/GgSdfHLYfps",
      "contentAlt": "Cool car video",
      "reactionLeft": "/images/reaction2.png",
      "reactionRight": "/images/reaction1.png"
    },
    {
      "title": "yo! what's 9 + 10?",
      "description": "'404!' :D<br>'you stoopid'",
      "type": "image",
      "content": "/images/teto.png",
      "contentAlt": "Teto confused"
    }
  ]
};

let lastPageIndex = -1;

function getRandomIndex(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor((array[0] / (0xffffffff + 1)) * max);
}

function getUniqueRandomIndex(max) {
  if (max <= 1) return 0;
  let newIndex;
  do {
    newIndex = getRandomIndex(max);
  } while (newIndex === lastPageIndex);
  lastPageIndex = newIndex;
  return newIndex;
}

function loadRandom404Page() {
  try {
    const pages = pages404.pages;
    const randomIndex = getUniqueRandomIndex(pages.length);
    const randomPage = pages[randomIndex];

    document.querySelector('.error-message').textContent = randomPage.title;
    document.querySelector('.error-description').innerHTML = randomPage.description;
    
    const mediaContainer = document.querySelector('.error-illustration').parentElement;
    const oldElement = document.querySelector('.error-illustration');
    
    if (oldElement) {
      oldElement.remove();
    }

    if (randomPage.type === 'youtube' || randomPage.type === 'youtube-with-reactions') {
      const iframe = document.createElement('iframe');
      const videoUrl = new URL(randomPage.content);
      videoUrl.searchParams.set('autoplay', '1');
      videoUrl.searchParams.set('mute', '1');
      videoUrl.searchParams.set('loop', '1');
      const videoId = videoUrl.pathname.split('/').pop();
      videoUrl.searchParams.set('playlist', videoId);
      iframe.src = videoUrl.toString();
      iframe.width = '800';
      iframe.height = '450';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.classList.add('error-illustration');
      iframe.style.width = '100%';
      iframe.style.maxWidth = '800px';
      iframe.style.height = 'auto';
      iframe.style.aspectRatio = '16/9';
      iframe.style.margin = '0';
      
      if (randomPage.reactionLeft && randomPage.reactionRight) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.gap = '30px';
        wrapper.style.margin = '30px auto';
        wrapper.style.flexWrap = 'wrap';
        wrapper.style.maxWidth = '100%';
        
        const leftReaction = document.createElement('img');
        const leftSrc = window.location.protocol === 'file:' 
          ? randomPage.reactionLeft.replace(/^\//, '') 
          : randomPage.reactionLeft;
        leftReaction.src = leftSrc;
        leftReaction.alt = 'Reaction';
        leftReaction.style.width = '150px';
        leftReaction.style.height = 'auto';
        leftReaction.style.objectFit = 'contain';
        leftReaction.style.flexShrink = '0';
        leftReaction.style.position = 'relative';
        leftReaction.style.cursor = 'pointer';
        leftReaction.title = '404 page inspired by gh0stp4wz';
        
        const tooltip = document.createElement('div');
        tooltip.textContent = '404 page inspired by gh0stp4wz';
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontSize = '14px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.marginBottom = '10px';
        tooltip.style.zIndex = '1000';
        
        const leftWrapper = document.createElement('div');
        leftWrapper.style.position = 'relative';
        leftWrapper.style.display = 'inline-block';
        leftWrapper.appendChild(leftReaction);
        leftWrapper.appendChild(tooltip);
        
        leftWrapper.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1';
        });
        
        leftWrapper.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
        });
        
        const videoContainer = document.createElement('div');
        videoContainer.style.flex = '1 1 auto';
        videoContainer.style.maxWidth = '800px';
        videoContainer.style.minWidth = '400px';
        videoContainer.appendChild(iframe);
        
        const rightReaction = document.createElement('img');
        const rightSrc = window.location.protocol === 'file:' 
          ? randomPage.reactionRight.replace(/^\//, '') 
          : randomPage.reactionRight;
        rightReaction.src = rightSrc;
        rightReaction.alt = 'Reaction';
        rightReaction.style.width = '150px';
        rightReaction.style.height = 'auto';
        rightReaction.style.objectFit = 'contain';
        rightReaction.style.flexShrink = '0';
        rightReaction.style.cursor = 'pointer';
        
        const rightTooltip = document.createElement('div');
        rightTooltip.textContent = 'special thank to kytronix for creating the page with me <3';
        rightTooltip.style.position = 'absolute';
        rightTooltip.style.bottom = '100%';
        rightTooltip.style.left = '50%';
        rightTooltip.style.transform = 'translateX(-50%)';
        rightTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        rightTooltip.style.color = 'white';
        rightTooltip.style.padding = '8px 12px';
        rightTooltip.style.borderRadius = '8px';
        rightTooltip.style.fontSize = '14px';
        rightTooltip.style.whiteSpace = 'nowrap';
        rightTooltip.style.opacity = '0';
        rightTooltip.style.pointerEvents = 'none';
        rightTooltip.style.transition = 'opacity 0.3s ease';
        rightTooltip.style.marginBottom = '10px';
        rightTooltip.style.zIndex = '1000';
        
        const rightWrapper = document.createElement('div');
        rightWrapper.style.position = 'relative';
        rightWrapper.style.display = 'inline-block';
        rightWrapper.appendChild(rightReaction);
        rightWrapper.appendChild(rightTooltip);
        
        rightWrapper.addEventListener('mouseenter', () => {
          rightTooltip.style.opacity = '1';
        });
        
        rightWrapper.addEventListener('mouseleave', () => {
          rightTooltip.style.opacity = '0';
        });
        
        wrapper.appendChild(leftWrapper);
        wrapper.appendChild(videoContainer);
        wrapper.appendChild(rightWrapper);
        mediaContainer.appendChild(wrapper);
      } else {
        mediaContainer.appendChild(iframe);
      }
    } else {
      const img = document.createElement('img');
      const imgSrc = window.location.protocol === 'file:' 
        ? randomPage.content.replace(/^\//, '') 
        : randomPage.content;
      img.src = imgSrc;
      img.alt = randomPage.contentAlt;
      img.classList.add('error-illustration');
      mediaContainer.appendChild(img);
    }
  } catch (error) {
    console.error('Error loading 404 page variant:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadRandom404Page);
} else {
  loadRandom404Page();
}

if (window.location.protocol !== 'file:') {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      loadRandom404Page();
    }
  });
}
