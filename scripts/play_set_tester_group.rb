# Attaches a Google Group to a Play testing track so that anyone who joins the group is a tester.
# Usage: PACKAGE_NAME=... JSON_KEY=... TRACK=alpha GROUP=name@googlegroups.com ruby scripts/play_set_tester_group.rb
# Only adds the group; groups already attached are kept. Never removes anything.
require 'google/apis/androidpublisher_v3'
require 'googleauth'

pkg, track, group = ENV.fetch('PACKAGE_NAME'), ENV.fetch('TRACK'), ENV.fetch('GROUP').strip.downcase
abort("#{group} does not look like a group address") unless group.match?(/\A[^@\s]+@[^@\s]+\.[^@\s]+\z/)
creds = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(ENV.fetch('JSON_KEY')), scope: 'https://www.googleapis.com/auth/androidpublisher')
api = Google::Apis::AndroidpublisherV3::AndroidPublisherService.new
api.authorization = creds
edit = api.insert_edit(pkg)
begin
  current = (api.get_edit_tester(pkg, edit.id, track).google_groups rescue nil) || []
  groups = (current + [group]).uniq
  api.update_edit_tester(pkg, edit.id, track, Google::Apis::AndroidpublisherV3::Testers.new(google_groups: groups))
  api.commit_edit(pkg, edit.id)
  puts "Track #{track}: tester groups are now #{groups.inspect}"
rescue => e
  api.delete_edit(pkg, edit.id) rescue nil
  abort("Could not attach the group: #{e.class}: #{e.message}")
end
