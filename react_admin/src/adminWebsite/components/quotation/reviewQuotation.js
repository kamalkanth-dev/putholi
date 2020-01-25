import React, { Component } from 'react'
import { withRouter } from 'react-router'
import './reviewQuotation.css'
import axios from 'axios'

class reviewQuotation extends Component {
    state={
        spinner:true,
        getRequirementList:true,
        totalAmount:0,
        reqList:null,
        comment:null,
        temp1:null,
        selectedQuotations:[]
    } 
    approveQuotation=()=>{
        let updateQuotation={
            totalAmount:this.state.totalAmount,
            quotations:this.state.selectedQuotations,
            comment:this.state.comment
        };
        this.setState({spinner:true});
        axios.post("http://localhost:6060/puthuyir/updateQuotation",updateQuotation)
        .then(res=>{
            window.alert("Quotations updated successfully")
            this.setState({spinner:false});
            this.props.history.push({
                pathname:"/adminPendingWorkflow",
                user:this.props.location.user,
                ...this.props
            })
        })
        .catch(error=>{
            this.setState({spinner:false});
            window.alert("Unable to update due to"+error);
        })
    }
    componentDidMount(){
        axios.post("http://localhost:6060/puthuyir/getQuotations/"+this.props.location.school.schoolId)
        .then(res=>{
            this.setState({
                reqList:res.data,
                spinner:false,
                getRequirementList:false
            })
        })
        .catch(error=>{
            window.alert("Unable to get quotations due to "+error)
        })
    }

    handleChange=({target})=>{
        this.setState({ 
            [target.id]: target.value , 
            lastErrorField:null,
            errorMessage:""
        });
    }
    selectQuotation=(e)=>{
        let reqId=e.target.id.split("/")[0];
        let quoId=e.target.id.split("/")[1];
        let quotationList=this.state.reqList[reqId];
        let temp=null;
        for(let i=0;i<quotationList.length;i++){
            let quotation=quotationList[i];
            if(quotation.quotationId+""==quoId+""){
                temp=quotation.totalAmount;
                let quotations=[
                    ...this.state.selectedQuotations,
                    quotation
                ];
                this.setState({
                    selectedQuotations:quotations
                })
            }
        }
        if(temp!==null){
            let newAmount=this.state.totalAmount+parseInt(temp);
            this.setState({totalAmount:newAmount});
        }
        else{
            this.setState({temp1:null})
        }
    }

    createTable=(iter)=>{
        var rows=[];
        let rowsUpdated=false;;
        let quotationList=this.state.reqList[iter];
        for(let i=0;i<quotationList.length;i++){
            let quotation=quotationList[i];
            rowsUpdated=true;
            rows.push(
                <tr>   
                    <td><input type="button" value="Show quotation"/></td>
                    <td><input type="checkbox" id={iter+"/"+quotation.quotationId} onChange={(e)=>this.selectQuotation(e)}></input></td>       
                    <td>{quotation.companyName}</td>
                    <td>{quotation.city}</td>
                    <td>{quotation.contact}</td>
                    <td>{quotation.quotationPreparedBy}</td>
                    <td>{quotation.quotationDate.split("T")[0]}</td>
                    <td>{quotation.quotationValidityDate.split("T")[0]}</td>
                    <td>{quotation.itemDescription}</td>
                    <td>{quotation.quantity}</td>
                    <td>{quotation.unitPrice}</td>
                    <td>{quotation.tax}</td>
                    <td>{quotation.shippingCost}</td>
                    <td>{quotation.totalAmount}</td>
                    <td>{quotation.warranty}</td>
                    </tr>
            )
        }
        if(rowsUpdated==false)
            rows.push(<tr ><td align="center" colSpan="5">No new records found!</td></tr>)
        return rows;
    }
    getContent=()=>{
        var content=[];
        let updated=false;
        for(let i=0;i<this.props.location.school.projects[0].requirements.length;i++){
            updated=true;
            let iter=this.props.location.school.projects[0].requirements[i].requirementId;
            content.push(
                <div>
                <section className="content-header">
                    <h4>
                    {this.props.location.school.projects[0].requirements[i].assetName}
                    </h4>
                    </section>
                    <section className="content">
                        <div className="row">
                        <div className="col-xs-12">
                            <div className="box">
                            <div className="box-header">
                            <h2 className="box-title">Select appropriate quotation</h2>
                                <div className="box-tools">
                                <div className="input-group input-group-sm" style={{width: 150}}>
                                    <input type="text" name="table_search" className="form-control pull-right" placeholder="Search" />
                                    <div className="input-group-btn">
                                    <button type="submit" className="btn btn-default"><i className="fa fa-search" /></button>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div class="box-body table-responsive no-padding">
                                <table class="table table-hover">
                                    <tbody>
                                <tr>
                                    <th colSpan="2"></th>
                                    <th><b>Company name</b></th>
                                    <th><b>City</b></th>
                                    <th><b>Contact</b></th>
                                    <th><b>Quotation prepared by</b></th>
                                    <th><b>Quotation Date</b></th>
                                    <th><b>Quotation valid date</b></th>
                                    <th><b>Item description</b></th>
                                    <th><b>Quantity</b></th>
                                    <th><b>Unit price</b></th>
                                    <th><b>Tax</b></th>
                                    <th><b>Shipping cost</b></th>
                                    <th><b>Total amount</b></th>
                                    <th><b>Warranty</b></th>
                                    </tr>
                                    {this.props.location.school.projects[0].requirements[i].requirementId!==null?this.createTable(iter):null}
                                    </tbody>
                                </table>
                            </div>                            
                        </div>
                    </div>
                </div>
              </section>
              </div>
            )
        }
        if(updated==false)
            content.push(<tr ><td align="center" colSpan="5">No new records found!</td></tr>)
        return content;
    }
    render() {
        return (
            <div>
            <div style={{fontSize:"large"}}>
                <div className="content-wrapper">
                    <h4>
                        {this.props.location.school.schoolInfo.schoolName}
                    </h4>
                {this.state.getRequirementList?null:this.getContent()}
                <section className="content">
                <div className="row">
                    <div className="form-group has-feedback col-md-3">
                        <h4>  Total Amount : </h4>
                    </div>
                    <div className="form-group has-feedback col-md-6">
                        <input type="input" className="form-control" id="country" value={this.state.totalAmount} onChange={this.handleChange} disabled/>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group has-feedback col-md-3">
                    <h4>  Comment : </h4>
                    </div>
                    <div className="form-group has-feedback col-md-6">
                        <input type="text-area" className="form-control" id="comment" value={this.state.comment} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="input-group-btn form-group has-feedback">
                        &nbsp;<button type="submit" className="btn btn-warning form-control" onClick={()=>this.approveQuotation()}>Approve</button>
                    </div> 
                    <div className="input-group-btn">
                        <button type="submit" className="btn btn-danger form-control">Cancel</button>
                    </div>
                </div>
                {this.state.spinner?<div class="spinner"></div>:null}
                </section>
                </div>
            </div>
        </div>
        )
    }
}
export default  withRouter(reviewQuotation);