function randomColor() {
    const colors = [
        /*--flickr-pink */ "#f72585ff",
        /*--byzantine */ "#b5179eff",
        /*--purple */ "#7209b7ff",
        /*--purple-2 */ "#560badff",
        /*--trypan-blue */ "#480ca8ff",
        /*--trypan-blue-2 */ "#3a0ca3ff",
        /*--persian-blue */ "#3f37c9ff",
        /*--ultramarine-blue */ "#4361eeff",
        /*--dodger-blue */ "#4895efff",
        /*--vivid-sky-blue */ "#4cc9f0ff",
    ];

    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
}

function indexedColor(index, schemeIndex) {
    let scheme;

    const pinkToBlue = [
        /*--flickr-pink */ "#f72585ff",
        /*--byzantine */ "#b5179eff",
        /*--purple */ "#7209b7ff",
        /*--purple-2 */ "#560badff",
        /*--trypan-blue */ "#480ca8ff",
        /*--trypan-blue-2 */ "#3a0ca3ff",
        /*--persian-blue */ "#3f37c9ff",
        /*--ultramarine-blue */ "#4361eeff",
        /*--dodger-blue */ "#4895efff",
        /*--vivid-sky-blue */ "#4cc9f0ff",
    ];

    const colors = [
        [
            // https://coolors.co/palette/310055-3c0663-4a0a77-5a108f-6818a5-8b2fc9-ab51e3-bd68ee-d283ff-dc97ff
            /*--russian-violet*/ "#310055ff",
            /*--persian-indigo*/ "#3c0663ff",
            /*--indigo*/ "#4a0a77ff",
            /*--blue-violet-color-wheel*/ "#5a108fff",
            /*--purple*/ "#6818a5ff",
            /*--dark-orchid*/ "#8b2fc9ff",
            /*--medium-orchid*/ "#ab51e3ff",
            /*--medium-orchid-2*/ "#bd68eeff",
            /*--heliotrope*/ "#d283ffff",
            /*--bright-lilac*/ "#dc97ffff",

        ], [
            // https://coolors.co/palette/641220-6e1423-85182a-a11d33-a71e34-b21e35-bd1f36-c71f37-da1e37-e01e37
            /*--persian-plum*/ "#641220ff",
            /*--burgundy*/ "#6e1423ff",
            /*--antique-ruby*/ "#85182aff",
            /*--crimson-ua*/ "#a11d33ff",
            /*--crimson-ua-2*/ "#a71e34ff",
            /*--red-ncs*/ "#b21e35ff",
            /*--cardinal*/ "#bd1f36ff",
            /*--cardinal-2*/ "#c71f37ff",
            /*--crimson*/ "#da1e37ff",
            /*--rose-madder*/ "#e01e37ff",
        ], [
            //https://coolors.co/palette/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-a6e6f2-b8ebf5-c6eff7
            /*--midnight-blue*/ "#03045eff",
            /*--dark-cornflower-blue*/ "#023e8aff",
            /*--star-command-blue*/ "#0077b6ff",
            /*--blue-green*/ "#0096c7ff",
            /*--pacific-blue*/ "#00b4d8ff",
            /*--sky-blue-crayola*/ "#48cae4ff",
            /*--middle-blue*/ "#90e0efff",
            /*--blizzard-blue*/ "#a6e6f2ff",
            /*--blizzard-blue-2*/ "#b8ebf5ff",
            /*--powder-blue*/ "#c6eff7ff",
        ], [
            // https://coolors.co/palette/ffedd8-f3d5b5-e7bc91-d4a276-bc8a5f-a47148-8b5e34-6f4518-603808-583101
            /*--antique-white*/ "#ffedd8ff",
            /*--peach-puff*/ "#f3d5b5ff",
            /*--gold-crayola*/ "#e7bc91ff",
            /*--tan-crayola*/ "#d4a276ff",
            /*--camel*/ "#bc8a5fff",
            /*--cafe-au-lait*/ "#a47148ff",
            /*--coyote-brown*/ "#8b5e34ff",
            /*--sepia*/ "#6f4518ff",
            /*--pullman-brown-ups-brown*/ "#603808ff",
            /*--pullman-brown-ups-brown-2*/ "#583101ff",
        ], [
            // https://coolors.co/palette/ff7b00-ff8800-ff9500-ffa200-ffaa00-ffb700-ffc300-ffd000-ffdd00-ffea00
            /*--heat-wave*/ "#ff7b00ff",
            /*--dark-orange*/ "#ff8800ff",
            /*--yellow-orange-color-wheel*/ "#ff9500ff",
            /*--orange-peel*/ "#ffa200ff",
            /*--chrome-yellow*/ "#ffaa00ff",
            /*--selective-yellow*/ "#ffb700ff",
            /*--mikado-yellow*/ "#ffc300ff",
            /*--cyber-yellow*/ "#ffd000ff",
            /*--golden-yellow*/ "#ffdd00ff",
            /*--middle-yellow*/ "#ffea00ff",
        ],
    ];

    if (schemeIndex === undefined) {
        scheme = pinkToBlue;
    } else {
        scheme = colors[schemeIndex % colors.length];
    }

    return scheme[index % scheme.length];
}
