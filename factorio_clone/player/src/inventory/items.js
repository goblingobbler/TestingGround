const ITEMS = {
    iron: {
        image: "iron.png",
        text: "iron",
    },

    miner: {
        image: "miner.png",
        text: "miner",
        building_details: {
            inputs: ["ground"],
            outputs: ["iron"],
            speed: 1,
            size: [2, 2],
        },
    },
};

export default ITEMS;
