import { test, expect } from '@playwright/test';
import {ToDoPage} from "../poms/pages/ToDoPage";

test('create todo item', async ({ page }) => {
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();
  await toDoPage.checkToDoItemsVisible(0);
  await toDoPage.createdToDoItem();
  await toDoPage.checkToDoItemsVisible(1);
});

test('create 2 todo items', async ({ page }) => {
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();
  await toDoPage.createdToDoItem();
  await toDoPage.createdToDoItem();
  await toDoPage.checkToDoItemsVisible(2);
});

test('activate card', async ({ page }) => {
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();
  const createdTodo = await toDoPage.createdToDoItem();
  await toDoPage.checkToDoItemsVisible(1);

  await createdTodo.activate();
  await createdTodo.checkIsActivated();
});

test('activate card - search by text', async ({ page }) => {
  const cardText = "test text"
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();
  await toDoPage.createdToDoItem(cardText);
  await toDoPage.checkToDoItemsVisible(1);
  const createdTodo = toDoPage.getToDoItemByText(cardText);

  await createdTodo.activate();
  await createdTodo.checkIsActivated();
});

test("delete card", async ({ page }) => {
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();
  const createdTodo = await toDoPage.createdToDoItem();
  await toDoPage.checkToDoItemsVisible(1);

  await createdTodo.deleteItem();
  await toDoPage.checkToDoItemsVisible(0);
});

test("create two cards - activate 1 - clear completed", async ({ page }) => {
  const cardText1 = "first card";
  const cardText2 = "second card";
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();

  await toDoPage.createdToDoItem(cardText1);
  await toDoPage.createdToDoItem(cardText2);

  const card1 = toDoPage.getToDoItemByText(cardText1);
  const card2 = toDoPage.getToDoItemByText(cardText2);

  await card1.activate();
  await card1.checkIsActivated();

  await toDoPage.clearCompletedTodoItems();
  await toDoPage.checkToDoItemsVisible(1);
  await card2.checkCardVisible()
})

test("create two cards - activate 1 - press completed", async ({ page }) => {
  const cardText1 = "first card";
  const cardText2 = "second card";
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();

  await toDoPage.createdToDoItem(cardText1);
  await toDoPage.createdToDoItem(cardText2);

  const card1 = toDoPage.getToDoItemByText(cardText1);
  const card2 = toDoPage.getToDoItemByText(cardText2);

  await card1.activate();
  await card1.checkIsActivated();

  await toDoPage.completedFilter();
  await toDoPage.checkToDoItemsVisible(1);
  await card2.checkCardVisible(false)
})

test("filter all and active cards", async ({ page }) => {
  const cardText1 = "first card";
  const cardText2 = "second card";
  const toDoPage = new ToDoPage(page);
  await toDoPage.goto();

  await toDoPage.createdToDoItem(cardText1);
  await toDoPage.createdToDoItem(cardText2);

  await toDoPage.checkToDoItemsVisible(2);

  const card1 = toDoPage.getToDoItemByText(cardText1);
  const card2 = toDoPage.getToDoItemByText(cardText2);
  await card1.activate();

  await toDoPage.activeFilter()
  await card1.checkCardVisible(false);
  await card2.checkCardVisible();

  await toDoPage.allFilter()
  await card1.checkCardVisible();
  await card2.checkCardVisible();

})