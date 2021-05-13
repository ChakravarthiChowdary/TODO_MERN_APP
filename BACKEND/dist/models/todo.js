"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Todo {
    constructor(id, title, description, userId, createdDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.createdDate = createdDate;
    }
}
exports.default = Todo;
