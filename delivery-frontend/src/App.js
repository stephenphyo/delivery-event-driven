import React, { useState } from 'react';

/* CSS Imports */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Component Imports */
import Delivery from './Delivery';

function App() {

    /* useState */
    const [id, setId] = useState('');

    /* Functions */
    const submit = async(e) => {
        e.preventDefault();
        const form_data = new FormData(e.target);
        const data = Object.fromEntries(form_data.entries());

        const res = await fetch('http://localhost:8000/deliveries/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'CREATE_DELIVERY',
                data
            })
        });
        const res_data = await res.json();
        setId(res_data.id);
    }

    return (
        <main className='py-5 app'>
            <div className='d-grid gap-2 d-sm-flex justify-content-sm-center mb-5'>
                {id === ''
                    ?
                    <div className='card'>
                        <div className='card-header'>Create Delivery</div>
                        <form className='card-body' onSubmit={(e) => submit(e)}>
                            <div className='mb-3'>
                                <input type='number' name='budget' className='form-control'
                                    placeholder='Budget' />
                            </div>
                            <div className='mb-3'>
                                <textarea name='notes' className='form-control' placeholder='Notes' />
                            </div>
                            <button className='btn btn-info'>Submit</button>
                        </form>
                    </div>
                    : <Delivery id={id} />
                }
            </div>
        </main>
    );
}

export default App;