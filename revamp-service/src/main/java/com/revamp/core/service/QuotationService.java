package com.revamp.core.service;

import java.util.List;
import java.util.Optional;

import com.revamp.core.model.Quotation;
import com.revamp.core.model.UpdateQuotation;

public interface QuotationService {

	long save(Quotation quotation);

	Optional<Quotation> getQuotation(long id);

	List<Quotation> getQuotations();

	void deleteQuotation(long id);

	List<Quotation> findByQuotationStatus(String quotationStatus);
	
	List<Quotation> findBySchoolId(long schoolId);

	List<Quotation> findByRequirementId(long requirementId);

	List<Quotation> findBySchoolIdAndRequirementId(long schoolId, long requirementId);

    Boolean updateQuotation(UpdateQuotation updateQuotation);
}
