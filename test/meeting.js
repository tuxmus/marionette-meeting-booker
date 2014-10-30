describe('Entities.Meeting', function(){
  describe('get() and set()', function(){
    it("returns the value set on the attribute", function(){
      var meeting = new MeetingBooker.Entities.Meeting();
      meeting.set('foo', 'bar');
      expect(meeting.get('foo')).to.be('bar');
    });
  });
});
