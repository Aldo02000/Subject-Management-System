const { expect } = require('chai');
const sinon = require('sinon');
const subjectController = require('../src/controllers/subjectController');
const subjectService = require('../src/services/subjectService');

describe('editSubjectDescription', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { subjectId: '123' },
            body: { description: 'New description' }
        };
        res = {
            redirect: sinon.spy()
        };
        next = sinon.spy();
        sinon.stub(subjectService, 'updateDescription').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should call subjectService.updateDescription with correct arguments', async () => {
        await subjectController.editSubjectDescription(req, res, next);
        expect(subjectService.updateDescription.calledWith('New description', '123')).to.be.true;
    });

    it('should redirect to the correct URL', async () => {
        await subjectController.editSubjectDescription(req, res, next);
        expect(res.redirect.calledWith('/subject/123')).to.be.true;
    });
});

describe('addAnnouncement', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { subjectId: '123' },
            body: { announcement: 'New announcement' }
        };
        res = {
            redirect: sinon.spy()
        };
        next = sinon.spy();
        sinon.stub(subjectService, 'insertAnnouncement').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should call subjectService.insertAnnouncement with correct arguments', async () => {
        await subjectController.addAnnouncement(req, res, next);
        expect(subjectService.insertAnnouncement.calledWith('123', 'New announcement')).to.be.true;
    });

    it('should redirect to the correct URL', async () => {
        await subjectController.addAnnouncement(req, res, next);
        expect(res.redirect.calledWith('/subject/123')).to.be.true;
    });

});
