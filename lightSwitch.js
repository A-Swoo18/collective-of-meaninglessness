document.addEventListener('DOMContentLoaded', () => {
    const lightSwitch = document.getElementById('lightSwitch');
    let isOn = false;

    lightSwitch.addEventListener('click', () => {
        isOn = !isOn;
        if (isOn) {
            lightSwitch.src = 'images/switch_on.png';
            document.body.classList.add('dark-mode');
        } else {
            lightSwitch.src = 'images/switch_off.png';
            document.body.classList.remove('dark-mode');
        }
    });
});
