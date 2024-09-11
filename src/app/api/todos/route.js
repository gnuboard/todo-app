// src/app/api/todos/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const todos = await query('SELECT * FROM todos ORDER BY id DESC');
    console.log('Fetched todos:', todos); // 디버깅을 위한 로그
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { task } = await request.json();
    if (!task || task.trim() === '') {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }
    const result = await query('INSERT INTO todos (task) VALUES (?)', [task]);
    if (result.affectedRows) {
      const newTodo = { id: result.insertId, task, completed: false };
      console.log('New todo added:', newTodo); // 디버깅을 위한 로그
      return NextResponse.json(newTodo, { status: 201 });
    } else {
      throw new Error('Failed to insert todo');
    }
  } catch (error) {
    console.error('Failed to add todo:', error);
    return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, task, completed } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }
    const updateFields = [];
    const updateValues = [];
    if (task !== undefined) {
      updateFields.push('task = ?');
      updateValues.push(task);
    }
    if (completed !== undefined) {
      updateFields.push('completed = ?');
      updateValues.push(completed);
    }
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    updateValues.push(id);
    const result = await query(
      `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    if (result.affectedRows) {
      const updatedTodo = { id, task, completed };
      console.log('Todo updated:', updatedTodo); // 디버깅을 위한 로그
      return NextResponse.json(updatedTodo);
    } else {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }
    const result = await query('DELETE FROM todos WHERE id = ?', [id]);
    if (result.affectedRows) {
      console.log('Todo deleted:', id); // 디버깅을 위한 로그
      return NextResponse.json({ message: 'Todo deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}