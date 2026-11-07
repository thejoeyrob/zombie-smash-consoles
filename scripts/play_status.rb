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
  begin
    d = api.get_edit_details(pkg, edit.id)
    puts "DETAILS default language=#{d.default_language.inspect} contactEmail set=#{!d.contact_email.to_s.empty?} contactWebsite=#{d.contact_website.inspect}"
  rescue => e
    puts "DETAILS could not be read (#{e.class})"
  end
  puts 'LISTINGS'
  begin
    (api.list_edit_listings(pkg, edit.id).listings || []).each do |l|
      puts "- #{l.language}: title=#{l.title.inspect} short=#{l.short_description.to_s.length} chars full=#{l.full_description.to_s.length} chars"
    end
  rescue => e
    puts "listings could not be read (#{e.class})"
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
