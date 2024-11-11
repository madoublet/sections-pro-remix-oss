class SpMediaPlayBlock {

    constructor(blockId) {

        var sp_play_button = `<svg class="sp-play-button" width="90" height="90" xmlns="http://www.w3.org/2000/svg"><path d="M44.5 0c6.156 0 11.94 1.168 17.355 3.504 5.414 2.337 10.124 5.507 14.129 9.512 4.005 4.005 7.175 8.715 9.512 14.129C87.832 32.559 89 38.345 89 44.5c0 6.156-1.168 11.94-3.504 17.355-2.337 5.414-5.507 10.124-9.512 14.129-4.005 4.005-8.715 7.175-14.129 9.512C56.441 87.832 50.655 89 44.5 89c-6.156 0-11.94-1.168-17.355-3.504-5.414-2.337-10.124-5.507-14.129-9.512-4.005-4.005-7.175-8.715-9.512-14.129C1.168 56.441 0 50.655 0 44.5c0-6.156 1.168-11.94 3.504-17.355 2.337-5.414 5.507-10.124 9.512-14.129 4.005-4.005 8.715-7.175 14.129-9.512C32.559 1.168 38.345 0 44.5 0ZM35 25v40l31-20-31-20Z" fill="#FFF" fill-rule="nonzero"/></svg>`;
        var sp_pause_button = `<svg class="sp-pause-button" width="90" height="90" xmlns="http://www.w3.org/2000/svg"><path d="M44.5 0c6.156 0 11.94 1.168 17.355 3.504 5.414 2.337 10.124 5.507 14.129 9.512 4.005 4.005 7.175 8.715 9.512 14.129C87.832 32.559 89 38.345 89 44.5c0 6.156-1.168 11.94-3.504 17.355-2.337 5.414-5.507 10.124-9.512 14.129-4.005 4.005-8.715 7.175-14.129 9.512C56.441 87.832 50.655 89 44.5 89c-6.156 0-11.94-1.168-17.355-3.504-5.414-2.337-10.124-5.507-14.129-9.512-4.005-4.005-7.175-8.715-9.512-14.129C1.168 56.441 0 50.655 0 44.5c0-6.156 1.168-11.94 3.504-17.355 2.337-5.414 5.507-10.124 9.512-14.129 4.005-4.005 8.715-7.175 14.129-9.512C32.559 1.168 38.345 0 44.5 0Zm-9.427 28A4.073 4.073 0 0 0 31 32.073v27.854a4.073 4.073 0 1 0 8.147 0V32.073A4.073 4.073 0 0 0 35.073 28Zm18.8 0a4.073 4.073 0 0 0-4.073 4.073v27.854a4.073 4.073 0 1 0 8.147 0V32.073A4.073 4.073 0 0 0 53.873 28Z" fill="#FFF" fill-rule="evenodd"/></svg>`;

        var sp_video_containers = document.querySelectorAll(`#sp-mb-${blockId} .sp-video-container`);

        for (var x = 0; x < sp_video_containers.length; x++) {
            sp_video_containers[x].innerHTML += sp_play_button;
            sp_video_containers[x].innerHTML += sp_pause_button;
        }

        var sp_videos = document.querySelectorAll(`#sp-mb-${blockId} .sp-video-container video`);

        for (var x = 0; x < sp_videos.length; x++) {

            sp_videos[x].parentNode.setAttribute('data-state', 'paused');

            if (sp_videos[x].hasAttribute('autoplay')) {
                sp_videos[x].parentNode.setAttribute('data-state', 'playing');
            }
            else {
                sp_videos[x].parentNode.setAttribute('data-state', 'paused');

            }

            sp_videos[x].addEventListener('click', (e) => {

                if (e.target.paused) {
                    e.target.play();
                    e.target.parentNode.setAttribute('data-state', 'playing');
                }
                else {
                    e.target.pause();
                    e.target.parentNode.setAttribute('data-state', 'paused');
                }
            });

        }
    }
}