import { NextResponse } from 'next/server';
import { getExpenses, createExpense, deleteExpense, updateExpense } from '@/lib/dataStore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let expenses = await getExpenses();
    if (category) {
      expenses = expenses.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }
    if (status) {
      expenses = expenses.filter(e => e.status?.toLowerCase() === status.toLowerCase());
    }
    return NextResponse.json(expenses, { status: 200 });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.description || body.amount === undefined) {
      return NextResponse.json({ error: 'Description and amount are required' }, { status: 400 });
    }
    const newExpense = await createExpense(body);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (err) {
    console.error('Error creating expense:', err);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const targetId = id || body.id || body._id;
    if (!targetId) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }
    const updated = await updateExpense(targetId, body);
    if (!updated) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('Error updating expense:', err);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }
    const success = await deleteExpense(id);
    if (!success) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error deleting expense:', err);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
