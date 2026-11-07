# Read-only: prints every Play track with its release names, status and version codes, and the tester groups. Changes nothing.
require 'google/apis/androidpublisher_v3'
require 'googleauth'

pkg = ENV.fetch('PACKAGE_NAME')
creds = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(ENV.fetch('JSON_KEY')), scope: 'https://www.googleapis.com/auth/androidpublisher')
api = Google::Apis::AndroidpublisherV3::AndroidPublisherService.new
api.authorization = creds
edit = api.insert_edit(pkg)
begin
  puts 'TRACKS'
  (api.list_edit_tracks(pkg, edit.id).tracks || []).each do |t|
    puts "- track #{t.track}"
    (t.releases || []).each do |r|
      puts "    release name=#{r.name.inspect} status=#{r.status} versionCodes=#{r.version_codes.inspect} userFraction=#{r.user_fraction.inspect}"
    end
  end
  puts 'TESTERS'
  %w[internal alpha].each do |track|
    begin
      t = api.get_edit_tester(pkg, edit.id, track)
      puts "- #{track}: google groups #{(t.google_groups || []).inspect}"
    rescue => e
      puts "- #{track}: could not read testers (#{e.class})"
    end
  end
ensure
  api.delete_edit(pkg, edit.id) rescue nil
end
