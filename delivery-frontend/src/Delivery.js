import React, { useState, useEffect } from 'react';

function Delivery({ id }) {

    /* useState */
    const [deliveryState, setDeliveryState] = useState({ id: 111, status: 'delivered' });
    const [refresh, setRefresh] = useState(false);

    /* Functions */
    const submit = async(e, eventType) => {
        e.preventDefault();

        const form_data = new FormData(e.target);
        const data = Object.fromEntries(form_data.entries());
        const res = await fetch('http://localhost:8000/deliveries/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: eventType,
                delivery_id: id,
                data
            })
        });

        if (!res.ok) {
            const { detail } = await res.json();
            alert(detail);
        }

        setRefresh(!refresh);
    };

    /* useEffect */
    useEffect(() => {
        (async () => {
            const res = await fetch(`http://localhost:8000/deliveries/${id}/status`);
            const data = await res.json();
            setDeliveryState(data);
        })()
    }, [refresh, id]);

    return (
        <div className='row w-100'>
            <div className='col-12 mb-4'>
                <h4 className='fw-bold text-white'>Delivery: {deliveryState.id}</h4>
            </div>

            <div className='col-12 mb-5'>
                <div className='progress'>
                    {deliveryState.status === 'ready'
                        ? <div className='progress-bar bg-success progress-bar-striped'
                            role='progressbar' style={{ width: '25%' }}></div>
                        : deliveryState.status === 'active'
                            ? <div className='progress-bar bg-success progress-bar-striped'
                                role='progressbar' style={{ width: '50%' }}></div>
                            : deliveryState.status === 'collected'
                                ? <div className='progress-bar bg-success progress-bar-striped'
                                    role='progressbar' style={{ width: '75%' }}></div>
                                : deliveryState.status === 'delivered'
                                    ? < div className='progress-bar bg-success progress-bar-striped'
                                        role='progressbar' style={{ width: '100%' }}></div>
                                    : <></>
                    }
                </div>
            </div>

            <div className='col-4'>
                <div className='card'>
                    <div className='card-header'>Start Delivery</div>
                    <form className='card-body' onSubmit={(e) => submit(e, 'START_DELIVERY')}>
                        <button className='btn btn-info'>Submit</button>
                    </form>
                </div>
            </div>

            <div className='col-4'>
                <div className='card'>
                    <div className='card-header'>Pickup Products</div>
                    <form className='card-body' onSubmit={(e) => submit(e, 'PICKUP_PRODUCTS')}>
                        <div className='input-group mb-3'>
                            <input type='number' name='purchase_price' className='form-control'
                                placeholder='Purchase Price' />
                            <input type='number' name='quantity' className='form-control'
                                placeholder='Quantity' />
                        </div>
                        <button className='btn btn-info'>Submit</button>
                    </form>
                </div>
            </div>

            <div className='col-4'>
                <div className='card'>
                    <div className='card-header'>Deliver Products</div>
                    <form className='card-body' onSubmit={(e) => submit(e, 'DELIVER_PRODUCTS')}>
                        <div className='input-group mb-3'>
                            <input type='number' name='sell_price' className='form-control'
                                placeholder='Sell Price' />
                            <input type='number' name='quantity' className='form-control'
                                placeholder='Quantity' />
                        </div>
                        <button className='btn btn-info'>Submit</button>
                    </form>
                </div>
            </div>

            <div className='col-4 offset-4 my-3'>
                <div className='card'>
                    <div className='card-header'>Increase Budget</div>
                    <form className='card-body' onSubmit={(e) => submit(e, 'INCREASE_BUDGET')}>
                        <div className='mb-3'>
                            <input type='number' name='budget' className='form-control'
                                placeholder='Budget' />
                        </div>
                        <button className='btn btn-info'>Submit</button>
                    </form>
                </div>
            </div>

            <code className='col-12 mt-4'>
                {JSON.stringify(deliveryState)}
            </code>
        </div>
    );
}

export default Delivery;