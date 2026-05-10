import {expect, Locator, Page} from "@playwright/test";
import {ToDoItem} from "../organisms/ToDoItem";
import {faker} from "@faker-js/faker/locale/en_GB";

export class ToDoPage {
    readonly page : Page;
    private readonly url = "https://todo-app.tallinn-learning.ee/";
    readonly header: Locator;
    readonly main: Locator;
    readonly footer: Locator;
    readonly todoItemInput: Locator;
    readonly clearCompletedBtn: Locator;
    readonly completedBtn: Locator;
    readonly activeBtn: Locator;
    readonly allBtn: Locator;

    //readonly externalFooter: Locator;

    constructor(page : Page) {
        this.page = page;
        this.header = page.getByTestId("header");
        this.main = page.getByTestId("main");
        this.footer = page.getByTestId("footer");
        this.todoItemInput = this.header.getByTestId("text-input");
        this.clearCompletedBtn =  this.footer.locator(".clear-completed");
        this.completedBtn =  this.footer.locator('a[href="#/completed"]');
        this.allBtn =  this.footer.locator('a[href="#/"]');
        this.activeBtn =  this.footer.locator('a[href="#/active"]');
    }
    protected getToDoItemByIndex(index: number): ToDoItem {
        return new ToDoItem(this.main.getByTestId("todo-item").nth(index));
    }

    public getToDoItemByText(text: string): ToDoItem {
        return new ToDoItem(this.main.locator('[data-testid="todo-item"]', {hasText: text}));
    }

    async goto(): Promise<void> {
        await this.page.goto(this.url);
    }

    async createdToDoItem(text?: string): Promise<ToDoItem> {
        await this.todoItemInput.fill(text == undefined? faker.word.words(2) : text);
        await this.todoItemInput.press("Enter");
        const todoItems = this.main.getByTestId("todo-item");
        const itemsCount = await todoItems.count();
        return this.getToDoItemByIndex(itemsCount - 1);
    }

    async checkToDoItemsVisible(expectedCount: number): Promise<void> {
        //const todoItems: ToDoItem[] = this.main.getByTestId("todo-item");
        const itemCount = await this.main.getByTestId("todo-item").count();
        expect(itemCount).toBe(expectedCount);
    }

    async clearCompletedTodoItems(): Promise<void> {
        await this.clearCompletedBtn.click();
    }

    async completedFilter(): Promise<void> {
        await this.completedBtn.click();
    }

    async activeFilter(): Promise<void> {
        await this.activeBtn.click();
    }

    async allFilter(): Promise<void> {
        await this.allBtn.click();

    }
}