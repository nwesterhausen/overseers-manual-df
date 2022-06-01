class Raw {
    identifier: string;
    name: string[];
    description: string;

    constructor(id = "no_id_provided") {
        this.identifier = id;
        this.name = [];
        this.description = "";
    }
}

export default Raw;