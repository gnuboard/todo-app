// src/app/api/todos/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const result = await query('SELECT * FROM todos WHERE id = ?', [id]);
    if (result.length > 0) {
      console.log('Fetched todo:', result[0]); // 디버깅을 위한 로그
      return NextResponse.json(result[0]);
    } else {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { task, completed } = await request.json();
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

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
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