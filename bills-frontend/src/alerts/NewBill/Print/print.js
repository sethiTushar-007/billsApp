import React, { useRef } from 'react';
import Parse from 'html-react-parser';
import './template.css';

class PrintPage extends React.Component {
    render() {
        console.log(this.props.dataToPrint.remarks);
        return (
            <div id="container">
                <div className="invoice-top">
                    <section id="memo">

                        <div className="company-info">
                            <span className="company-name">Dino Store</span>

                            <span className="spacer"></span>

                            <div>30000 Bedrock | Cobblestone County</div>
                            <div>227 Cobblestone Road |</div>


                            <span className="clearfix"></span>

                            <div>| +555 7 789-1234</div>
                            <div>http://dinostore.bed | hello@dinostore.bed</div>
                        </div>

                    </section>

                    <section id="invoice-info">
                        <div>
                            <span>Issue Date:</span>
                        </div>

                        <div>
                            <span>{this.props.dataToPrint.date}</span>
                        </div>

                        <span className="clearfix"></span>

                        <section id="invoice-title-number">

                            <span id="title">INVOICE</span>
                            <span id="number">#{this.props.dataToPrint.no}</span>

                        </section>
                    </section>

                    <section id="client-info">
                        <span>Bill to:</span>
                        <div>
                            <span className="bold">{this.props.dataToPrint.customerName}</span>
                        </div>
                    </section>

                    <div className="clearfix"></div>
                </div>

                <div className="clearfix"></div>

                <div className="invoice-body">
                    <section id="items">
                        
                        <table className="print-table" cellpadding="0" cellspacing="0">
                            <tr>
                                <th></th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Rate(Rs.)</th>
                                <th>Amount(Rs.)</th>
                            </tr>
                            {this.props.dataToPrint.items.map((element, index) =>
                                <tr data-iterate="item">
                                    <td>{index+1}.</td>
                                    <td>{element.name}</td>
                                    <td>{element.quantity}</td>
                                    <td>{element.rate}</td>
                                    <td>{element.amount}</td>
                                </tr>
                            )}
                        </table>
                        
                    </section>

                    <section id="sums">

                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <th>Items</th>
                                <td>{this.props.dataToPrint.items.length}</td>
                                <td></td>
                            </tr>

                            <tr>
                                <th>Quantity</th>
                                <td>{this.props.dataToPrint.quantity}</td>
                                <td></td>
                            </tr>

                            <tr>
                                <th>Grand Total</th>
                                <td>Rs. {this.props.dataToPrint.amount}</td>
                                <td></td>
                            </tr>

                        </table>

                    </section>

                    <div className="clearfix"></div>
                    <br /><br />
                    {(this.props.dataToPrint.remarks && this.props.dataToPrint.remarks.length >7) &&
                        <div className="remarks-with-title" style={{ paddingLeft: '25px', paddingRight: '25px' }}>
                            <div style={{ textAlign: 'center' }}><h3>Remarks: </h3></div>
                            <br /><hr />
                        <div className="remarks" style={{ padding: 35 }}>
                            {Parse(this.props.dataToPrint.remarks)}
                            </div><hr /><br/>
                        </div>
                    }
                    <section id="terms">

                        <span className="hidden">terms_label</span>
                        <div>Thank you very much. We really appreciate your business.
<br/>Please send payments before the due date.</div>

                    </section>

                    <div className="payment-info">
                        <div>You can send payments at: ACC:123006705 | IBAN:US100000060345 | SWIFT:BOA447</div>
                    </div>
                </div>

            </div>
        );
    }
}

export default PrintPage;